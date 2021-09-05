import { escapeSpecialCharacters } from '../../../modules/components/syntax-highlighter/escapeSpecialCharacters.js';

export function testEscapeSpecialCharacters(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': '\t', 'out': '\t'},
		{'in': '\n', 'out': '\n'},
		{'in': 'fd', 'out': 'fd'},
		{'in': ' ;  \t\rsome comment', 'out': ' ;  \t\rsome comment'},
		{'in': 'x>y', 'out': 'x&gt;y'},
		{'in': '>', 'out': '&gt;'},
		{'in': '<', 'out': '&lt;'},
		{'in': '<=', 'out': '&lt;='},
		{'in': '>=', 'out': '&gt;='},
		{'in': '<>', 'out': '&lt;&gt;'},
		{'in': '&', 'out': '&amp;'},
		{'in': '[', 'out': '['},
		{'in': ']', 'out': ']'},
		{'in': 'print "Hello', 'out': 'print "Hello'},
		{'in': 'print (sum 1 2 3)', 'out': 'print (sum 1 2 3)'}
	];
	cases.forEach(function(caseInfo) {
		const result = escapeSpecialCharacters(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
};