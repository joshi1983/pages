import { processValidationTestCases } from './processValidationTestCases.js';
import { validateUnaryOperators } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateUnaryOperators.js';

export function testValidateUnaryOperators(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'print -:x', 'error': false},
		{'code': 'print :x-:y', 'error': false},
		{'code': '-', 'error': true},
		{'code': 'print -', 'error': true},
	];
	processValidationTestCases(cases, logger, validateUnaryOperators);
};