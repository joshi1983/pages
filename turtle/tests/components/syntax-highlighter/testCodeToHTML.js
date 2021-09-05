import { codeToHTML } from '../../../modules/components/syntax-highlighter/codeToHTML.js';
import { escapeSpecialCharacters } from '../../../modules/components/syntax-highlighter/escapeSpecialCharacters.js';

export function testCodeToHTML(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': '; https://www.google.com',
			'out': '<span class="comment">; <a href="https://www.google.com" target="_blank">https://www.google.com</a></span>'},
		{'in': '; https://www.google.com and https://www.canada.gc.ca',
			'out': '<span class="comment">; <a href="https://www.google.com" target="_blank">https://www.google.com</a> and <a href="https://www.canada.gc.ca" target="_blank">https://www.canada.gc.ca</a></span>'},
		{'in': ';https://www.google.com', 'out': '<span class="comment">;<a href="https://www.google.com" target="_blank">https://www.google.com</a></span>'},
		{'in': 'fd 100', 'out': '<span class="parameterized-group" id="code-to-html-test-0-1">fd</span> <span class="number-literal" id="code-to-html-test-0-5">100</span>'},
		{'in': 'fd 100\r', 'out': '<span class="parameterized-group" id="code-to-html-test-0-1">fd</span> <span class="number-literal" id="code-to-html-test-0-5">100</span>\r'},
		{'in': '\tfd 100', 'out': '\t<span class="parameterized-group" id="code-to-html-test-0-2">fd</span> <span class="number-literal" id="code-to-html-test-0-6">100</span>'},
		{'in': '\t\tfd 100', 'out': '\t\t<span class="parameterized-group" id="code-to-html-test-0-3">fd</span> <span class="number-literal" id="code-to-html-test-0-7">100</span>'},
		{'in': 'print "Hello', 'out': '<span class="parameterized-group" id="code-to-html-test-0-4">print</span> <span class="string-literal" id="code-to-html-test-0-11">"Hello</span>'},
		{'in': '; Hello World comment', 'out': '<span class="comment">; Hello World comment</span>'},
		{'in': '; Hello ; World comment', 'out': '<span class="comment">; Hello ; World comment</span>'},
		{'in': '; Hello \n; World comment', 'out': '<span class="comment">; Hello </span>\n<span class="comment">; World comment</span>'},
		{'in': 'fd 100 ; Hello \nprint "Hello',
			'out': '<span class="parameterized-group" id="code-to-html-test-0-1">fd</span> <span class="number-literal" id="code-to-html-test-0-5">100</span> <span class="comment">; Hello </span>\n<span class="parameterized-group" id="code-to-html-test-1-4">print</span> <span class="string-literal" id="code-to-html-test-1-11">"Hello</span>'},
		{'in': 'print 7. ; Some comment',
			'out': '<span class="parameterized-group" id="code-to-html-test-0-4">print</span> <span class="number-literal" id="code-to-html-test-0-7">7.</span> <span class="comment">; Some comment</span>'}
	];
	cases.forEach(function(caseInfo)  {
		caseInfo.out = '<span id="code-to-html-test-highlighter-lines-from-0">' + caseInfo.out + '</span>';
	});
	cases.forEach(function(caseInfo, index) {
		const result = codeToHTML(caseInfo.in, undefined, undefined, 'code-to-html-test');
		if (result === undefined)
			logger('Result is unexpectedly unddefined at index ' + index);
		else if (result.html !== caseInfo.out)
			logger(`Case index ${index} Expected "${escapeSpecialCharacters(caseInfo.out)}" but got "${escapeSpecialCharacters(result.html)}"`);
	});
};