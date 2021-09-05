import { codeToHTML } from '../../../modules/components/syntax-highlighter/codeToHTML.js';
import { escapeSpecialCharacters } from '../../../modules/components/syntax-highlighter/escapeSpecialCharacters.js';

export function testCodeToHTML(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'forward:x', 'out': '<span class="parameterized-group">forward</span><span class="variable-read">:x</span>'},
		{'in': '; https://www.google.com',
			'out': '<span class="comment">; <a href="https://www.google.com" target="_blank">https://www.google.com</a></span>'},
		{'in': '; https://www.google.com and https://www.canada.gc.ca',
			'out': '<span class="comment">; <a href="https://www.google.com" target="_blank">https://www.google.com</a> and <a href="https://www.canada.gc.ca" target="_blank">https://www.canada.gc.ca</a></span>'},
		{'in': ';https://www.google.com', 'out': '<span class="comment">;<a href="https://www.google.com" target="_blank">https://www.google.com</a></span>'},
		{'in': 'fd 100', 'out': '<span class="parameterized-group">fd</span> <span class="number-literal">100</span>'},
		{'in': 'fd 100\r', 'out': '<span class="parameterized-group">fd</span> <span class="number-literal">100</span>\r'},
		{'in': '\tfd 100', 'out': '\t<span class="parameterized-group">fd</span> <span class="number-literal">100</span>'},
		{'in': '\t\tfd 100', 'out': '\t\t<span class="parameterized-group">fd</span> <span class="number-literal">100</span>'},
		{'in': 'print "Hello', 'out': '<span class="parameterized-group">print</span> <span class="string-literal">"Hello</span>'},
		{'in': '; Hello World comment', 'out': '<span class="comment">; Hello World comment</span>'},
		{'in': '; Hello ; World comment', 'out': '<span class="comment">; Hello ; World comment</span>'},
		{'in': '; Hello \n; World comment', 'out': '<span class="comment">; Hello </span>\n<span class="comment">; World comment</span>'},
		{'in': 'fd 100 ; Hello \nprint "Hello',
			'out': '<span class="parameterized-group">fd</span> <span class="number-literal">100</span> <span class="comment">; Hello </span>\n<span class="parameterized-group">print</span> <span class="string-literal">"Hello</span>'},
		{'in': 'print 7. ; Some comment',
			'out': '<span class="parameterized-group">print</span> <span class="number-literal">7.</span> <span class="comment">; Some comment</span>'},
		{'in': 'print \'',
			'out': '<span class="parameterized-group">print</span> <span class="string-literal">\'</span>'},
		{'in': '\'\n',
			'out': '<span class="string-literal">\'</span>\n'},
		{'in': 'print \'\n',
			'out': '<span class="parameterized-group">print</span> <span class="string-literal">\'</span>\n'},
		{'in': `'s:
; https://www.c.pdf
to nag
p`, 
		'out': `<span class="string-literal">\'s:</span>
<span class="string-literal">; <a href="https://www.c.pdf" target="_blank">https://www.c.pdf</a></span>
<span class="string-literal">to nag</span>
<span class="string-literal">p</span>`},
		{'in': '\'\n\'', 'out': '<span class="string-literal">\'</span>\n<span class="string-literal">\'</span>'}
	];
	cases.forEach(function(caseInfo, index) {
		const result = codeToHTML(caseInfo.in, undefined, undefined, 'code-to-html-test');
		if (result === undefined)
			logger('Result is unexpectedly unddefined at index ' + index);
		else if (result.html !== caseInfo.out)
			logger(`Case index ${index} Expected "${escapeSpecialCharacters(caseInfo.out)}" but got "${escapeSpecialCharacters(result.html)}"`);
	});
};