import { processTestCases } from
'../../processTestCases.js';
import { simplifyBinaryOperators } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyBinaryOperators.js';

export function testSimplifyBinaryOperators(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print -:x', 'logged': false},
		{'code': `to p
	forward 10 ; side effect
	output 2
end
print p*:x`, 'logged': false},
		{'code': 'print cos 90+90', 'logged': false},
			// Another simplifier should handle the 90+90
			// which can become 180 and cos of a constant.

		{'code': 'print :x-:x', 'to': 'print 0', 'logged': true},
		{'code': 'print pi-pi', 'to': 'print 0', 'logged': true},
		{'code': 'print PI-pi', 'to': 'print 0', 'logged': true},
		{'code': 'print goldenRatio-goldenRatio', 'to': 'print 0', 'logged': true},
		{'code': 'print 2-2', 'to': 'print 0', 'logged': true},
		{'code': 'print 2.0-2', 'to': 'print 0', 'logged': true},
		{'code': 'print 0-0', 'to': 'print 0', 'logged': true},
		{'code': 'print :x*0', 'to': 'print 0', 'logged': true},
		{'code': 'print :x*0.0', 'to': 'print 0', 'logged': true},
		{'code': 'print 0*:x', 'to': 'print 0', 'logged': true},
		{'code': 'print 0.0*:x', 'to': 'print 0', 'logged': true},
		{'code': 'print :x-0', 'to': 'print :x', 'logged': true},
		{'code': 'print :x+0', 'to': 'print :x', 'logged': true},
		{'code': 'print 0+:x', 'to': 'print :x', 'logged': true},
		{'code': 'print 0+1', 'to': 'print 1', 'logged': true},
		{'code': 'print 0+pi', 'to': 'print pi', 'logged': true},
		{'code': 'print 0+0', 'to': 'print 0', 'logged': true},
		{'code': 'print pi/1', 'to': 'print pi', 'logged': true},
		{'code': 'print goldenRatio/1', 'to': 'print goldenRatio', 'logged': true},
		{'code': 'print randomRatio/1', 'to': 'print randomRatio', 'logged': true},
		{'code': 'print :x/1', 'to': 'print :x', 'logged': true},
		{'code': 'print 5/1', 'to': 'print 5', 'logged': true},
	];
	processTestCases(cases, simplifyBinaryOperators, logger);
};