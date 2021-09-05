import { processTestCases } from './processTestCases.js';
import { unrecognizedParameterizedGroupNameFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/unrecognizedParameterizedGroupNameFixer.js';

export function testUnrecognizedParameterizedGroupNameFixer(logger) {
	const cases = [
		{'code': 'pendown', 'logged': false},
		{'code': '# p\nreturn', 'logged': false},
		/* don't change because it looks like a WebTurtle return which marks the 
		end of a procedure instead of returning a value.
		In other words, this "return" is more of an "end" than an "output" in WebLogo.
		*/
		{'code': 'setItem 3 "cell tr', 'to': 'setItem 3 "cell right', 'logged': true, 'ignoreParseErrors': true},

		{'code': 'to p\nreturn 3\nend', 'to': 'to p\noutput 3\nend', 'logged': true},
		{'code': 'pen down', 'to': 'pendown ', 'logged': true},
		{'code': 'pri nt 5', 'to': 'print  5', 'logged': true},
		{'code': '(pri nt 5)', 'to': '(print  5)', 'logged': true},
		{'code': '(pri nt 1 5)', 'to': '(print  1 5)', 'logged': true},
		{
			'code': 'make "x createPList\npprop "x "prop1',
			'to': 'make "x createPList\nsetProperty "x "prop1',
			'logged': true,
			'ignoreParseErrors': true
		},
	];
	processTestCases(cases, unrecognizedParameterizedGroupNameFixer, logger);
};