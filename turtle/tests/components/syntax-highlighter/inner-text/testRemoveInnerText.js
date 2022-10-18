import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { removeInnerText } from '../../../../modules/components/syntax-highlighter/inner-text/removeInnerText.js';
import { simplifyHTML } from '../simplifyHTML.js';
import { testRemoveText } from './testRemoveText.js';
import { wrappedCodeToHTML } from '../wrappedCodeToHTML.js';
const containerID = 'remove-inner-text-test';

function sanitizeCase(caseInfo) {
	if (caseInfo.inHTML === undefined && caseInfo.inText !== undefined)
		caseInfo.inHTML = wrappedCodeToHTML(caseInfo.inText, containerID, true);
	if (caseInfo.outHTML === undefined && caseInfo.inText !== undefined)
		caseInfo.outHTML = wrappedCodeToHTML(caseInfo.inText.substring(0, caseInfo.startIndex) + caseInfo.inText.substring(caseInfo.startIndex + caseInfo.len), containerID, true);
}

function testGeneralCases(logger) {
	const cases = [
		{'inHTML': 'hello world', 'startIndex': 0, 'len': 0, 'outHTML': 'hello world'},
		{'inHTML': 'hello world', 'startIndex': 0, 'len': 1, 'outHTML': 'ello world'},
		{'inHTML': 'hello world', 'startIndex': 1, 'len': 1, 'outHTML': 'hllo world'},
		{'inHTML': '<strong>hello world</strong>', 'startIndex': 0, 'len': 1, 'outHTML': '<strong>ello world</strong>'},
		{'inHTML': 'he', 'startIndex': 1, 'len': 1, 'outHTML': 'h'},
		{'inHTML': 'hello world', 'startIndex': 5, 'len': 6, 'outHTML': 'hello'},
		{
			'inHTML': '<span class="parameterized-group">print</span> <span class="number-literal">1</span><span class="binary-literal">+</span><span class="number-literal">4</span>',
			'startIndex': 8,
			'len': 1,
			'outHTML': '<span class="parameterized-group">print</span> <span class="number-literal">1</span><span class="binary-literal">+</span>'
		},
		{
			'inHTML': '<span class="string-literal">\'\'</span>',
			'startIndex': 1,
			'len': 1,
			'outHTML': '<span class="string-literal">\'</span>'
		},
		{
			'inHTML': '<span class="parameterized-group">print</span> <span class="string-literal">\'\'</span>',
			'startIndex': 7,
			'len': 1,
			'outHTML': '<span class="parameterized-group">print</span> <span class="string-literal">\'</span>'
		},
		{
			'inHTML': '<span class="parameterized-group">fd</span> <span class="number-literal">40</span>',
			'startIndex': 4,
			'len': 1,
			'outHTML': '<span class="parameterized-group">fd</span> <span class="number-literal">4</span>'
		},
		{
			'inText': 'fd  4', 
			'startIndex': 2,
			'len': 1
		},
		{
			'inText': 'fd 4\n', 
			'startIndex': 4,
			'len': 1
		},
		{
			'inText': 'fd 4\nfd 100', 
			'startIndex': 4,
			'len': 7
		},
		{
			'inText': 'fd 4 fd 1', 
			'startIndex': 4,
			'len': 5
		},
		{
			'inText': 'fd 4 fd',
			'startIndex': 4,
			'len': 3
		},
		{
			'inText': 'fd 4 fd',
			'startIndex': 5,
			'len': 2
		},
		{
			'inText': 'print 4 1',
			'startIndex': 8,
			'len': 1
		},
		{
			'inText': 'print 4 1',
			'startIndex': 7,
			'len': 2
		},
		{
			'inHTML': '<span class="parameterized-group" id="set-inner-text-test-0-1">fd</span> <span class="number-literal" id="set-inner-text-test-0-3">4</span> <span class="parameterized-group" id="set-inner-text-test-0-6">fd</span> <span class="number-literal" id="set-inner-text-test-0-8">1</span>',
			'startIndex': 4,
			'len': 5,
			'outHTML': '<span class="parameterized-group">fd</span> <span class="number-literal">4</span>'
		},
		{
			'inHTML': '<span class="parameterized-group" id="set-inner-text-test-0-1">fd</span> <span class="number-literal" id="set-inner-text-test-0-3">4</span> <span class="parameterized-group" id="set-inner-text-test-0-6">fd</span> <span class="number-literal" id="set-inner-text-test-0-8">1</span>',
			'startIndex': 4,
			'len': 5,
			'outHTML': '<span class="parameterized-group" id="set-inner-text-test-0-1">fd</span> <span class="number-literal" id="set-inner-text-test-0-3">4</span>'
		}
	];
	cases.forEach(sanitizeCase);
	const procNameSet = new Set();
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const div = document.createElement('div');
		const container = document.createElement('pre');
		const lineGroup = document.createElement('span');
		lineGroup.setAttribute('id', 'set-inner-text-test-highlighter-lines-from-0');
		div.appendChild(container);
		lineGroup.innerHTML = caseInfo.inHTML;
		container.appendChild(lineGroup);
		testRemoveText(lineGroup, caseInfo.startIndex, caseInfo.len, caseInfo.outHTML, plogger);
		if (lineGroup.parentNode !== container)
			plogger(`Expected lineGroup.parentNode to continue matching its container but got ${lineGroup.parentNode}`);
	});
}

function testSpecialCase(logger) {
	const procNameSet = new Set();
	const pre = document.createElement('pre');
	let lineGroup = document.createElement('span');
	pre.appendChild(lineGroup);
	lineGroup.outerHTML = '<span id="set-inner-text-test-highlighter-lines-from-0"><span class="parameterized-group" id="set-inner-text-test-0-1">fd</span> <span class="number-literal" id="set-inner-text-test-0-3">4</span> <span class="parameterized-group" id="set-inner-text-test-0-6">fd</span> <span class="number-literal" id="set-inner-text-test-0-8">1</span></span>';
	lineGroup = pre.querySelector(':scope > span');
	const result = removeInnerText(lineGroup, 4, 5, procNameSet);
	const expectedHTML = '<span class="parameterized-group">fd</span> <span class="number-literal">4</span>';
	if (result !== 5)
		logger(`Expected result to be 5 but got ${result}`);
	const actualHTML = simplifyHTML(lineGroup.innerHTML);
	if (actualHTML !== expectedHTML)
		logger(`Expected innerHTML to be "${escapeHTML(expectedHTML)}" but got "${escapeHTML(actualHTML)}"`);
}

export function testRemoveInnerText(logger) {
	testGeneralCases(prefixWrapper('testGeneralCases', logger));
	testSpecialCase(prefixWrapper('testSpecialCase', logger));
};