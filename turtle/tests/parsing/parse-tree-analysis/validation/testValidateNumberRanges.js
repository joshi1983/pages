import { processValidationTestCases } from './processValidationTestCases.js';
import { validateNumberRanges } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateNumberRanges.js';

export function testValidateNumberRanges(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'fd 100', 'error': false},
		{'code': 'print sqrt 0.1', 'error': false},
		{'code': 'repeat 3 [print "hi]', 'error': false},
		{'code': 'print []', 'error': false},
		{'code': 'print item 1 [1 2]', 'error': false},
		{'code': 'repeat 0 [print "hi]', 'error': true},
		{'code': 'print sqrt -1', 'error': true},
		{'code': 'print item 0 [1 2]', 'error': true},
		{'code': 'print item 1 - 1 [1 2]', 'error': true}, // 1 - 1 evaluates to 0.
		{'code': 'print char -1', 'error': true},
		{'code': 'print char 0', 'error': false},
		{'code': 'print char 100', 'error': false},
		{'code': 'print char 255', 'error': false},
		{'code': 'print char 256', 'error': true},
		{'code': 'print char 1000', 'error': true},
		{'code': `to p :startRadius :endRadius :separation
	localmake "maxRadius max :startRadius :endRadius
	ifelse :separation <= :maxRadius -
	(min :startRadius :endRadius) [
	] [
		localmake "size1 :endRadius - :startRadius
		localmake "angle1 arcSin :size1 / :separation
	]
end

p 100 50 -20`, 'error': false, 'warn': true},
		{'code': `to p :startRadius :endRadius :separation
	ifelse false [
	] [
		localmake "size1 :endRadius - :startRadius
		localmake "angle1 arcSin :size1 / :separation
	]
end

p 100 50 -20`, 'error': true, 'warn': false},
		{'code': `if false [
			print sqrt -1
	]`, 'error': true, 'warn': false},
		{'code': `if true [
			print sqrt -1
	]`, 'error': true, 'warn': false},
/* If inputs are constant(not depending on any variables or procedures), we always want to error even if the token isn't almost definitely going to execute.
If the problem just might be dependent on a variable, we only want to warn(not error).
*/

		{'code': `to p :x
			stop
			print sqrt :x
	end
p -4`, 'error': false, 'warn': true},
/* We want to warn instead of error when the involved token isn't almost definitely going to execute and when a variable is being read.
*/

		{'code': `to p :x
			if :x < 4 [stop]
			print sqrt :x
	end
p -4`, 'error': false, 'warn': true},
/* We want to warn instead of error when the involved token isn't almost definitely going to execute and when a variable is being read.
*/
	];
	processValidationTestCases(cases, logger, validateNumberRanges);
};