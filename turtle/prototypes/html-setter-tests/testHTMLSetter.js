import { escapeHTML } from '../../tests/helpers/escapeHTML.js';
import { prefixWrapper } from '../../tests/helpers/prefixWrapper.js';
import { SelectiveHTMLSetter } from '../../modules/components/syntax-highlighter/SelectiveHTMLSetter.js';

function validateSelectiveSetter(setter, logger) {
	if (!(setter instanceof SelectiveHTMLSetter))
		return;
	if (setter.pastLines.length !== setter.lineDivs.length) {
		logger(`Expected pastLines and lineDivs to share the same length but pastLines.length = ${setter.pastLines.length}, lineDivs.length = ${setter.lineDivs.length}`);
	}
	else {
		for (let i = 0; i < setter.pastLines.length; i++) {
			const html = setter.pastLines[i];
			if (html !== setter.lineDivs[i].innerHTML) {
				logger(escapeHTML(`Expected lineDivs[${i}] to have innerHTML of '${html}' but got '${setter.lineDivs[i].innerHTML}'`));
			}
			if (setter.container.children[i] !== setter.lineDivs[i]) {
				logger(`Expected children[${i}] to equal lineDivs[${i}] but they're not equal`);
			}
		}
	}
	if (setter.container.children.length !== setter.pastLines.length) {
		logger(`Expected container.children.length to equal ${setter.pastLines.length} but got ${setter.container.children.length}`);
	}
	if (setter.pastLines.length === 0) {
		if (setter.container.firstChild !== null)
			logger(`Expected firstChild to be null but got ${setter.container.firstChild}`);
	}
}


function basicTest(logger, Setter) {
	const lines = ['<span class="parameterized-group">print</span> <span class="string-literal">"hello</span>'];
	const div = document.createElement('div');
	const setter = new Setter(div);
	validateSelectiveSetter(setter, prefixWrapper('immediately after constructor', logger));
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, prefixWrapper('after first setHTMLLines call', logger));
	let expected = 'print "hello';
	if (div.children.length !== 1)
		logger(`Expected div.children.length to be 1 but got ${div.children.length}`);
	if (div.innerText !== expected)
		logger(`In initial check, expected to get innerText ${expected} but got ${div.innerText}`);
	lines.push('print');
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, logger);
	if (div.children.length !== 2)
		logger(`Expected div.children.length to be 2 but got ${div.children.length}`);
	expected = 'print "helloprint';
	if (div.innerText !== expected)
		logger(`expected to get innerText ${expected} but got ${div.innerText}`);
	lines.pop();
	if (lines.length !== 1)
		logger(`Expected lines.length to be 1 but got ${lines.length}`);
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, prefixWrapper('after last call to setHTMLLines', logger));
	if (div.children.length !== 1)
		logger(`After pop(), expected div.children.length to be 1 but got ${div.children.length}`);
	expected = 'print "hello';
	if (div.innerText !== expected)
		logger(`after pop(), expected to get innerText ${expected} but got ${div.innerText}`);
}

function blankLines(logger, Setter) {
	const lines = ['', ''];
	const div = document.createElement('div');
	const setter = new Setter(div);
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, prefixWrapper('after first setHTMLLines', logger));
	if (div.children.length !== 2)
		logger(`After first setHTMLLines, expected div.children.length to be 2 but got ${div.children.length}`);
	lines.push('');
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, prefixWrapper('after second setHTMLLines', logger));
	if (div.children.length !== 3)
		logger(`After second setHTMLLines, expected div.children.length to be 2 but got ${div.children.length}`);
}

function getEndingNumber(e) {
	if (e instanceof Element)
		e = e.innerText;
	if (typeof e !== 'string')
		throw new Error(`Expected string but got ${e}`);
	let result = '';
	for (let i = e.length - 1; i >= 0; i--) {
		const ch = e[i];
		if (ch >= '0' && ch <= '9')
			result = ch + result;
		else
			break;
	}
	return parseInt(result);
}

function getHTML(i) {
	if (!Number.isInteger(i))
		throw new Error(`i must be an int but got ${i}`);
	return `<span class="parameterized-group">print</span> <span class="string-literal">"hello${i}</span>`;
}

function htmlToText(s) {
	const div = document.createElement('div');
	div.innerHTML = s;
	return div.innerText;
}

function insertLines(logger, Setter) {
	const lines = [];
	const div = document.createElement('div');
	const setter = new Setter(div);
	let i = 10;
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, logger);
	lines.push(getHTML(i++));
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, logger);
	if (div.children.length !== 1)
		logger(`Expected div.children.length to be 1 but got ${div.children.length}`);
	let endingNum = getEndingNumber(htmlToText(lines[0]));
	if (endingNum !== 10)
		logger(`Expected lines[0] to end with 10 but got ${endingNum}`);
	endingNum = getEndingNumber(div.children[0]);
	if (endingNum !== 10)
		logger(`Expected 10 to end last line's text but got ${endingNum}`);
	lines.push(getHTML(i++));
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, logger);
	if (div.children.length > 1) {
		endingNum = getEndingNumber(div.children[1]);
		if (endingNum !== 11)
			logger(`Expected 11 to end last line's text but got ${endingNum}`);
	}
	else {
		logger(`Expected div.children.length to be at least 2 but got ${div.children.length}`);
	}
	lines.unshift(getHTML(0));
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, logger);
	endingNum = getEndingNumber(div.children[0]);
	if (endingNum !== 0)
		logger(`Expected 0 to end last line's text but got ${endingNum}`);
}

function removeLastLines(logger, Setter) {
	const lines = [];
	for (let i = 0; i < 10; i ++) {
		lines.push(`<span class="parameterized-group">print</span> <span class="string-literal">"hello${i}</span>`);
	}
	const div = document.createElement('div');
	const setter = new Setter(div);
	validateSelectiveSetter(setter, logger);
	for (let i = 0; i < 5; i++)
		lines.pop();
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, logger);
	if (div.children.length !== 5)
		logger(`Expected 5 children but got ${div.children.length}`);
}

function removeLines(logger, Setter) {
	const lines = [];
	for (let i = 0; i < 10; i ++) {
		lines.push(`<span class="parameterized-group">print</span> <span class="string-literal">"hello${i}</span>`);
	}
	const div = document.createElement('div');
	const setter = new Setter(div);
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, logger);
	if (div.children.length !== 10)
		logger(`Expected 10 children but got ${div.children.length}`);
	let endingNum = getEndingNumber(div.children[9]);
	if (endingNum !== 9)
		logger(`Expected 10 to end last line's text but got ${endingNum}`);
	lines.splice(0, 1);
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, logger);
	if (div.children.length !== 9)
		logger(`Expected 9 children but got ${div.children.length}`);
	endingNum = getEndingNumber(div.children[0]);
	if (endingNum !== 1)
		logger(`Expected 1 to end last line's text but got ${endingNum}`);
	lines.splice(3, 1);
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, logger);
	if (div.children.length !== 8)
		logger(`Expected 8 children but got ${div.children.length}`);
	endingNum = getEndingNumber(div.children[3]);
	if (endingNum !== 5)
		logger(`Expected 5 to end last line's text but got ${endingNum}`);
	lines.splice(lines.length - 1, 1);
	setter.setHTMLLines(lines);
	validateSelectiveSetter(setter, logger);
	if (div.children.length !== 7)
		logger(`Expected 7 children but got ${div.children.length}`);
}

export function testHTMLSetter(logger, Setter) {
	basicTest(prefixWrapper('basicTest', logger), Setter);
	blankLines(prefixWrapper('blankLines', logger), Setter);
	insertLines(prefixWrapper('insertLines', logger), Setter);
	removeLastLines(prefixWrapper('removeLastLines', logger), Setter);
	removeLines(prefixWrapper('removeLines', logger), Setter);
};