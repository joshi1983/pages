import { processValidationTestCases } from './processValidationTestCases.js';
import { validateUselessCode } from '../../../../modules/parsing/parse-tree-analysis/validation/validateUselessCode.js';

export function testValidateUselessCode(logger) {
	const cases = [
		{'code': '', 'warn': false, 'error': false},
		{'code': 'fd 100', 'warn': false, 'error': false},
		{'code': 'fd 0', 'warn': true, 'error': false},
		{'code': 'fd 1-1', 'warn': true, 'error': false},
		{'code': 'arc2 10 100', 'warn': false, 'error': false},
		{'code': 'arc2 0 100', 'warn': true, 'error': false},
		{'code': 'if false [print "hi]', 'warn': true, 'error': false},
		{'code': 'if false [circle 0]', 'warn': true, 'error': false},
		{'code': 'ifelse false [circle 0][]', 'warn': true, 'error': false},
		{'code': 'ifelse true [][circle 0]', 'warn': true, 'error': false},
		{'code': 'while false [print "hi]', 'warn': true, 'error': false},
		{'code': 'while true [print "hi]', 'warn': false, 'error': false},
		{'code': 'arcLeft 0 5', 'warn': true, 'error': false},
		{'code': 'arcLeft 5 0', 'warn': false, 'error': true},
		{'code': 'to p\nstop\narcLeft 5 0\nend', 'warn': true, 'error': false},
	];
	processValidationTestCases(cases, logger, validateUselessCode);
};