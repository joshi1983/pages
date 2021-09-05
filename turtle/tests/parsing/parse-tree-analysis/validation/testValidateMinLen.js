import { processValidationTestCase } from './processValidationTestCase.js';
import { validateMinLen } from '../../../../modules/parsing/parse-tree-analysis/validation/validateMinLen.js';

export function testValidateMinLen(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'print pick [1]', 'error': false},
		{'code': 'print pick [1 2]', 'error': false},
		{'code': 'print pick []', 'error': true},
		{'code': 'print first []', 'error': true},
		{'code': 'print first [3]', 'error': false},
		{'code': 'print first "', 'error': true},
		{'code': 'print first "Hello', 'error': false}
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateMinLen);
	});
};