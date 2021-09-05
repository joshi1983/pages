import { processTestCases } from '../processTestCases.js';
import { genericSimplifyConditions } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/genericSimplifyConditions.js';

export function testGenericSimplifyConditions(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print "hi', 'logged': false},
		{'code': 'to p\nend\np', 'logged': false},
		{'code': 'if true []', 'logged': false},
		{'code': 'if x []', 'logged': false},
		{'code': 'ifelse true [] []', 'logged': false},
		{'code': 'ifelse x [] []', 'logged': false},
		{'code': 'while true []', 'logged': false},
		{'code': 'while x []', 'logged': false},
		{'code': 'do.while [] true', 'logged': false},
		{'code': 'do.while [] x', 'logged': false},
		{'code': 'until true []', 'logged': false},
		{'code': 'until x []', 'logged': false},
		{'code': 'if 1 < 2 []', 'to': 'if  true  []', 'logged': true},
		{'code': 'if 2 < 1 []', 'to': 'if  false  []', 'logged': true},
		{'code': 'ifelse 1 < 2 [] []', 'to': 'ifelse  true  [] []', 'logged': true},
		{'code': 'ifelse 2 < 1 [] []', 'to': 'ifelse  false  [] []', 'logged': true},
		{'code': 'while 1 < 2 []', 'to': 'while  true  []', 'logged': true},
		{'code': 'while 2 < 1 []', 'to': 'while  false  []', 'logged': true},
		{'code': 'do.while [] 1 < 2', 'to': 'do.while []  true ', 'logged': true},
		{'code': 'do.while [] 2 < 1', 'to': 'do.while []  false ', 'logged': true},
		{'code': 'until 1 < 2 []', 'to': 'until  true  []', 'logged': true},
		{'code': 'until 3 < 2 []', 'to': 'until  false  []', 'logged': true},
		{'code': 'until 2 > 1 []', 'to': 'until  true  []', 'logged': true},
		{'code': 'print "hi\nuntil 2 > 1 []', 'to': 'print "hi\nuntil  true  []', 'logged': true},
	];
	processTestCases(cases, genericSimplifyConditions(() => true), logger);
};