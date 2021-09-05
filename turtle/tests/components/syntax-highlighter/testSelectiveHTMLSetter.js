import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { SelectiveHTMLSetter } from '../../../modules/components/syntax-highlighter/SelectiveHTMLSetter.js';
import { validateSelectiveHTMLSetter } from './validateSelectiveHTMLSetter.js';

function compareLines(setter, lines, logger) {
	if (setter.pastLines.length !== lines.length)
		logger(`Expected lengths to match but lines.length = ${lines.length}, pastLines.length = ${setter.pastLines.length}`);
	else {
		for (let i = 0; i < lines.length; i++) {
			if (lines[i] !== setter.pastLines[i] && setter.pastLines[i] !== ' ')
				logger(escapeHTML(`Expected [${i}] to be ${lines[i]} but got ${setter.pastLines[i]}`));
		}
	}
}

function basicTest(logger, Setter) {
	const lines = ['<span class="parameterized-group">print</span> <span class="string-literal">"hello</span>'];
	const div = document.createElement('div');
	const setter = new Setter(div);
	validateSelectiveHTMLSetter(setter, prefixWrapper('immediately after constructor', logger));
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, prefixWrapper('after first setHTMLLines call', logger));
	let expected = 'print "hello';
	if (div.children.length !== 1)
		logger(`Expected div.children.length to be 1 but got ${div.children.length}`);
	if (div.innerText !== expected)
		logger(`In initial check, expected to get innerText ${expected} but got ${div.innerText}`);
	lines.push('print');
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, logger);
	if (div.children.length !== 2)
		logger(`Expected div.children.length to be 2 but got ${div.children.length}`);
	expected = 'print "helloprint';
	if (div.innerText !== expected)
		logger(`expected to get innerText ${expected} but got ${div.innerText}`);
	lines.pop();
	if (lines.length !== 1)
		logger(`Expected lines.length to be 1 but got ${lines.length}`);
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, prefixWrapper('after last call to setHTMLLines', logger));
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
	validateSelectiveHTMLSetter(setter, prefixWrapper('after first setHTMLLines', logger));
	if (div.children.length !== 2)
		logger(`After first setHTMLLines, expected div.children.length to be 2 but got ${div.children.length}`);
	lines.push('');
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, prefixWrapper('after second setHTMLLines', logger));
	if (div.children.length !== 3)
		logger(`After second setHTMLLines, expected div.children.length to be 2 but got ${div.children.length}`);
}

function changeMiddleLines(logger) {
	const lines = ['1', '2', '3'];
	const div = document.createElement('div');
	const setter = new SelectiveHTMLSetter(div);
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, prefixWrapper(`after initial setHTMLLines`, logger));
	compareLines(setter, lines, logger);
	lines[1] = '5';
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, prefixWrapper(`after replacing [1] with '5'`, logger));
	if (setter.pastLines[1] !== '5')
		logger(`Expected pastLines[1] to be '5' but got ${setter.pastLines[1]}`);
	lines[1] = '8';
	lines[3] = '10';
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, prefixWrapper(`after replacing [1] with '8'`, logger));
	compareLines(setter, lines, logger);
	if (setter.pastLines[1] !== '8')
		logger(`Expected pastLines[1] to be '8' but got ${setter.pastLines[1]}`);
	if (setter.pastLines[3] !== '10')
		logger(`Expected pastLines[3] to be '10' but got ${setter.pastLines[3]}`);
	lines[3] = '8';
	lines[4] = '10';
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, prefixWrapper(`after replacing [3] with '8' and [4] with '10'`, logger));
	compareLines(setter, lines, logger);
	if (setter.pastLines.length !== 5)
		logger(`Expected pastLines.length to be 5 but got ${setter.pastLines.length}`);
	if (setter.pastLines[3] !== '8')
		logger(`Expected pastLines[3] to be 8 but got ${setter.pastLines[3]}`);
	if (setter.pastLines[4] !== '10')
		logger(`Expected pastLines[4] to be 10 but got ${setter.pastLines[4]}`);
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

function insertBlankLines(logger) {
	const lines = ['<span class="">to</span> <span>p</span>',
		'\t<span class="parameterized-group">polyStart</span>',
		'\t<span class="parameterized-group">polyStart</span>',
		'\t<span class="parameterized-group">polyStart</span>',
		'\t<span class="parameterized-group">polyStart</span>',
		'\t<span class="parameterized-group">polyStart</span>',
		'\t<span class="parameterized-group">polyStart</span>',
		'\t<span class="parameterized-group">polyStart</span>',
		'<span>end</span>',
		'',
		'<span>p</span>'];
	const div = document.createElement('div');
	const setter = new SelectiveHTMLSetter(div);
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, logger);
	compareLines(setter, lines, logger);
	// remove some lines.
	for (let i = 0; i < 3; i++) {
		lines.splice(1, 1, '');
		setter.setHTMLLines(lines);
		validateSelectiveHTMLSetter(setter, logger);
		compareLines(setter, lines, logger);
	}
	// insert some blank lines.
	for (let i = 0; i < 2; i++) {
		lines.splice(1, 0, '');
		setter.setHTMLLines(lines);
		validateSelectiveHTMLSetter(setter, logger);
		compareLines(setter, lines, logger);
	}
}

function insertLines(logger, Setter) {
	const lines = [];
	const div = document.createElement('div');
	const setter = new Setter(div);
	let i = 10;
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, logger);
	lines.push(getHTML(i++));
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, logger);
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
	validateSelectiveHTMLSetter(setter, logger);
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
	validateSelectiveHTMLSetter(setter, logger);
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
	validateSelectiveHTMLSetter(setter, logger);
	for (let i = 0; i < 5; i++)
		lines.pop();
	lines[2] = 'hello world';
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, logger);
	if (div.children.length !== 5)
		logger(`Expected 5 children but got ${div.children.length}`);
	if (div.innerText.indexOf('undefined') !== -1)
		logger(`Did not expect to find undefined in the container's innerText but did.  The innerText became: ${div.innerText}`);
}

function removeLines(logger, Setter) {
	const lines = [];
	for (let i = 0; i < 10; i ++) {
		lines.push(`<span class="parameterized-group">print</span> <span class="string-literal">"hello${i}</span>`);
	}
	const div = document.createElement('div');
	const setter = new Setter(div);
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, logger);
	if (div.children.length !== 10)
		logger(`Expected 10 children but got ${div.children.length}`);
	let endingNum = getEndingNumber(div.children[9]);
	if (endingNum !== 9)
		logger(`Expected 10 to end last line's text but got ${endingNum}`);
	lines.splice(0, 1);
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, logger);
	if (div.children.length !== 9)
		logger(`Expected 9 children but got ${div.children.length}`);
	endingNum = getEndingNumber(div.children[0]);
	if (endingNum !== 1)
		logger(`Expected 1 to end last line's text but got ${endingNum}`);
	lines.splice(3, 1);
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, logger);
	if (div.children.length !== 8)
		logger(`Expected 8 children but got ${div.children.length}`);
	endingNum = getEndingNumber(div.children[3]);
	if (endingNum !== 5)
		logger(`Expected 5 to end last line's text but got ${endingNum}`);
	lines.splice(lines.length - 1, 1);
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, logger);
	if (div.children.length !== 7)
		logger(`Expected 7 children but got ${div.children.length}`);
}

function removeLinesFromMiddle(logger) {
	const lines = [];
	for (let i = 0; i < 5; i ++) {
		lines.push(`${i}`);
	}
	const div = document.createElement('div');
	const setter = new SelectiveHTMLSetter(div);
	setter.setHTMLLines(lines);
	lines.splice(1, 3);
	setter.setHTMLLines(lines);
	validateSelectiveHTMLSetter(setter, logger);
	compareLines(setter, lines, logger);
}

export function testSelectiveHTMLSetter(logger) {
	const Setter = SelectiveHTMLSetter;
	basicTest(prefixWrapper('basicTest', logger), Setter);
	blankLines(prefixWrapper('blankLines', logger), Setter);
	changeMiddleLines(prefixWrapper('changeMiddleLines', logger));
	insertBlankLines(prefixWrapper('insertBlankLines', logger));
	insertLines(prefixWrapper('insertLines', logger), Setter);
	removeLastLines(prefixWrapper('removeLastLines', logger), Setter);
	removeLines(prefixWrapper('removeLines', logger), Setter);
	removeLinesFromMiddle(prefixWrapper('removeLinesFromMiddle', logger));
};