import { processValidationTestCases } from './processValidationTestCases.js';
import { validateAssert } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateAssert.js';

export function testValidateAssert(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'assert false', 'error': true},
		{'code': 'assert true', 'error': false},
	];
	processValidationTestCases(cases, logger, validateAssert);
};