import { codeToHTML } from '../../../modules/components/syntax-highlighter/codeToHTML.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { setInnerTextSyntaxHighlighted } from '../../../modules/components/syntax-highlighter/setInnerTextSyntaxHighlighted.js';
import { simplifyHTML } from './simplifyHTML.js';
import { testRemoveText } from './inner-text/testRemoveText.js';
import { wrappedCodeToHTML } from './wrappedCodeToHTML.js';

const containerID = 'set-inner-text-test';

function insert(originalCode, index, val) {
	return originalCode.substring(0, index) + val + originalCode.substring(index);
}

function remove(originalCode, index, val) {
	return originalCode.substring(0, index) + originalCode.substring(index + val);
}

function replace(originalCode, index, val) {
	if (!(val instanceof Array))
		throw new Error('replace required val to be an Array.  Not: ' + val);
	if (val.length !== 2)
		throw new Error(`replace requires val.length to be 2 but got ${val.length}`);
	originalCode = remove(originalCode, index, val[0]);
	return insert(originalCode, index, val[1]);
}

const changeMethods = {
	'insert': insert,
	'remove': remove,
	'replace': replace
};

function processChange(originalCode, changeInfo) {
	if (typeof changeMethods[changeInfo.type] !== 'function')
		throw new Error('type not recognized: ' + changeInfo.type);
	if (!Number.isInteger(changeInfo.index))
		throw new Error('index must be an integer.  Not: ' + changeInfo.index);
	return changeMethods[changeInfo.type](originalCode, changeInfo.index, changeInfo.val);
}

export function testSetInnerTextSyntaxHighlightedWithCodeToHTML(logger) {
	const cases = [
		{'code': ';', 'changes': [
			{'type': 'remove', 'index': 0, 'val': 1},
			{'type': 'insert', 'index': 1, 'val': '5'},
			{'type': 'insert', 'index': 1, 'val': ';'},
			{'type': 'insert', 'index': 1, 'val': '; '},
			{'type': 'insert', 'index': 1, 'val': '\n'},
			{'type': 'insert', 'index': 1, 'val': '; \n '},
			{'type': 'insert', 'index': 1, 'val': '; \n\t\r'},
			{'type': 'insert', 'index': 1, 'val': ' https://www.google.com'},
			{'type': 'insert', 'index': 1, 'val': ' https://www.google.com\n'},
			{'type': 'replace', 'index': 0, 'val': [1, 'to p']},
		]},
		{'code': 'fd 4', 'changes': [
			{'type': 'insert', 'index': 4, 'val': '5'},
			{'type': 'insert', 'index': 4, 'val': ';'},
			{'type': 'insert', 'index': 4, 'val': '; '},
			{'type': 'insert', 'index': 4, 'val': ';hi'},
			{'type': 'insert', 'index': 4, 'val': '\n'},
			{'type': 'insert', 'index': 4, 'val': '+5'},
			{'type': 'insert', 'index': 4, 'val': '-5'},
			{'type': 'insert', 'index': 4, 'val': '*5'},
			{'type': 'insert', 'index': 3, 'val': ' '},
			{'type': 'insert', 'index': 3, 'val': '\t'},
			{'type': 'insert', 'index': 3, 'val': '\r'},
			{'type': 'insert', 'index': 3, 'val': '5'},
			{'type': 'insert', 'index': 3, 'val': ' 5'},
			{'type': 'insert', 'index': 3, 'val': '+5'},
		]},
		{'code': 'fd 40', 'changes': [
			{'type': 'remove', 'index': 4, 'val': 1},
			{'type': 'remove', 'index': 3, 'val': 1}
		]},
		{'code': 'fd 4 fd 1', 'changes': [
			{'type': 'remove', 'index': 4, 'val': 5, 'removeTextOnly': true}
		]},
		{'code': 'fd 4 fd', 'changes': [
			{'type': 'remove', 'index': 5, 'val': 2},
			{'type': 'remove', 'index': 4, 'val': 3}
		]},
		{'code': 'fd 4\nfd 1', 'changes': [
			{'type': 'remove', 'index': 4, 'val': 5}
		]},
		{'code': 'print "hi', 'changes': [
			{'type': 'insert', 'index': 9, 'val': '5'},
			{'type': 'insert', 'index': 9, 'val': ';'},
			{'type': 'insert', 'index': 9, 'val': ' '},
			{'type': 'insert', 'index': 9, 'val': ' h'},
			{'type': 'remove', 'index': 7, 'val': 1},
			{'type': 'remove', 'index': 7, 'val': 2},
			{'type': 'replace', 'index': 7, 'val': [2, 'https://www.google.com']},
			{'type': 'remove', 'index': 6, 'val': 1},
		]},
		{'code': 'print \'\'', 'changes': [
			{'type': 'insert', 'index': 7, 'val': '5'},
			{'type': 'insert', 'index': 7, 'val': 'https://www.google.com'},
			{'type': 'remove', 'index': 6, 'val': 1},
		]},
		{'code': 'print true', 'changes': [
			{'type': 'insert', 'index': 6, 'val': 't'},
			{'type': 'insert', 'index': 6, 'val': 'false '},
			{'type': 'replace', 'index': 6, 'val': [1, 'f']},
		]},
		{'code': 'setPenColor "#fff', 'changes': [
			{'type': 'insert', 'index': 14, 'val': 'f'},
			{'type': 'replace', 'index': 14, 'val': [1, 'g']},
		]},
		{'code': 'print 1+4', 'changes': [
			{'type': 'remove', 'index': 8, 'val': 1},
			{'type': 'insert', 'index': 7, 'val': '2'},
			{'type': 'insert', 'index': 9, 'val': '5'},
		]},
		{'code': '\n'.repeat(10) + 'print true', 'changes': [
			{'type': 'insert', 'index': 16, 'val': 't'}
		]},
		{'code': '\n'.repeat(12) + 'print true', 'changes': [
			{'type': 'insert', 'index': 18, 'val': 't'}
		]},
		{'code': '\n'.repeat(5) + ';' + '\n'.repeat(7) + 'print true', 'changes': [
			{'type': 'insert', 'index': 19, 'val': 't'}
		]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code="${caseInfo.code}"`, logger);
		const div = document.createElement('div');
		const e = document.createElement('pre');
		div.appendChild(e);
		e.id = containerID;
		const procNameSet = new Set();
		caseInfo.changes.forEach(function(changeInfo, changeIndex) {
			const cplogger = prefixWrapper(`Change Case ${changeIndex}`, plogger);
			const inHTML = wrappedCodeToHTML(caseInfo.code, containerID, false);
			e.innerHTML = inHTML;
			const changedCode = processChange(caseInfo.code, changeInfo);
			const expectedHTML = wrappedCodeToHTML(changedCode, containerID, false);
			if (changeInfo.removeTextOnly === true) {
				const lineGroup = e.querySelector(':scope > span[id]');
				const expectedLineGroupHTML = wrappedCodeToHTML(changedCode, containerID, true);
				testRemoveText(lineGroup, changeInfo.index, changeInfo.val, expectedLineGroupHTML, prefixWrapper('testRemoveText', cplogger));
				e.innerHTML = inHTML;
			}
			setInnerTextSyntaxHighlighted(changedCode, e, procNameSet);
			const resultText = e.innerText;
			const resultHTML = e.innerHTML;
			if (resultText !== changedCode)
				cplogger(`Expected result text to be "${changedCode}" but got "${resultText}"`);
			if (simplifyHTML(resultHTML) !== simplifyHTML(expectedHTML))
				cplogger(`Expected result HTML to be "${escapeHTML(simplifyHTML(expectedHTML))}" but got "${escapeHTML(simplifyHTML(resultHTML))}".  Original input HTML was "${simplifyHTML(escapeHTML(inHTML))}"`);
		});
	});
};