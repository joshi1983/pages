import { escapeHTML } from '../../helpers/escapeHTML.js';
import { Highlighter } from '../../../modules/components/syntax-highlighter/highlighters/Highlighter.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { setInnerTextSyntaxHighlighted } from '../../../modules/components/syntax-highlighter/setInnerTextSyntaxHighlighted.js';

function testComposite(logger) {
	const cases = [
		{'code': '', 'oldCode': '', 'result': ''},
		{'code': '', 'oldCode': 'h', 'result': ''},
		{'code': 'h', 'oldCode': '', 'result': 'h'},
		{'code': '', 'oldCode': 'hello', 'result': ''},
		{'code': 'hello', 'oldCode': '', 'result': 'hello'},
		{'code': 'hello', 'oldCode': 'hello world', 'result': 'hello'},
		{'code': 'hello world', 'oldCode': 'hello', 'result': 'hello world'},
	];
	const procNameSet = new Set();
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, oldCode=${caseInfo.oldCode}`, logger);
		const e = document.createElement('pre');
		e.id = 'test-container';
		e.innerHTML = Highlighter.addLinesToContainerHTML(e.id, caseInfo.oldCode);
		setInnerTextSyntaxHighlighted(caseInfo.code, e, procNameSet);
		const result = e.innerText;
		if (result !== caseInfo.code)
			plogger(`Expected "${caseInfo.code}" but got "${result}"`);
	});
}

function testWithHTML(logger) {
	const cases = [
		{'code': '', 'oldHTML': '', 'result': '<span id="test-container-highlighter-lines-from-0"></span>'},
		{'code': '', 'oldHTML': 'h', 'result': '<span id="test-container-highlighter-lines-from-0"></span>'},
	];
	const procNameSet = new Set();
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, oldHTML=${escapeHTML(caseInfo.oldHTML)}`, logger);
		const e = document.createElement('pre');
		e.id = 'test-container';
		e.innerHTML = Highlighter.addLinesToContainerHTML(e.id, caseInfo.oldHTML);
		setInnerTextSyntaxHighlighted(caseInfo.code, e, procNameSet);
		const resultText = e.innerText;
		if (resultText !== caseInfo.code)
			plogger(`Expected result text to be ${caseInfo.code} but got ${resultText}`);
		const resultHTML = e.innerHTML;
		if (resultHTML !== caseInfo.result)
			plogger(`Expected result HTML to be "${escapeHTML(caseInfo.result)}" but got "${escapeHTML(resultHTML)}"`);
	});
}

export function testSetInnerTextSyntaxHighlighted(logger) {
	testComposite(prefixWrapper('testComposite', logger));
	testWithHTML(prefixWrapper('testWithHTML', logger));
};