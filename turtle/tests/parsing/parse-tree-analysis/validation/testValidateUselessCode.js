import { processValidationTestCase } from './processValidationTestCase.js';
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
		{'code': 'while false [print "hi]', 'warn': true, 'error': false},
		{'code': 'while true [print "hi]', 'warn': false, 'error': false},
		{'code': 'arcLeft 0 5', 'warn': true, 'error': false},
		{'code': 'arcLeft 5 0', 'warn': false, 'error': true},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateUselessCode);
	});
};