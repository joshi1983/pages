import { tildeFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/tildeFixer.js';
import { processTestCases } from './processTestCases.js';

export function testTildeFixer(logger) {
	const cases = [
		{'code': 'print "hi', 'logged': false},
		{'code': 'print \'~\'', 'logged': false},
		{'code': '~', 'to': '', 'logged': true},
		{'code': 'print "hi ~', 'to': 'print "hi ', 'logged': true},
		{'code': 'repeat ~ 4 []', 'to': 'repeat  4 []', 'logged': true},
		{'code': 'repeat 4 ~ []', 'to': 'repeat 4  []', 'logged': true},
		{'code': 'repeat 4 [] ~', 'to': 'repeat 4 [] ', 'logged': true},
	];
	processTestCases(cases, tildeFixer, logger);
};