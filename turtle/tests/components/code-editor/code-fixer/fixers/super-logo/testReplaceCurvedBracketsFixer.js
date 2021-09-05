import { processTestCases } from
'../processTestCases.js';
import { replaceCurvedBracketsFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/super-logo/replaceCurvedBracketsFixer.js';

export function testReplaceCurvedBracketsFixer(logger) {
	const cases = [
		{'code': 'repeat 2 []', 'logged': false},
		{'code': 'print (2 + 3)', 'logged': false},
		{'code': 'print []', 'logged': false},
		{'code': 'repeat 3 ()', 'logged': true, 'to': 'repeat 3 []'},
		{'code': 'repeat 3 (print "hi )', 'logged': true, 'to': 'repeat 3 [print "hi ]'},
		{'code': 'if true ()', 'logged': true, 'to': 'if true []'},
		{'code': 'if true (print "hi )', 'logged': true, 'to': 'if true [print "hi ]'},
		{'code': 'while true ()', 'logged': true, 'to': 'while true []'},
		{'code': 'while true (print "hi )', 'logged': true, 'to': 'while true [print "hi ]'},
	];
	processTestCases(cases, replaceCurvedBracketsFixer, logger);
};