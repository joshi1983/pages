import { processValidationTestCases } from './processValidationTestCases.js';
import { validateMaxLen } from '../../../../modules/parsing/parse-tree-analysis/validation/validateMaxLen.js';

export function testValidateMaxLen(logger) {
	const cases = [
		{'code': 'print cross [1 2 3] [4 5 6]', 'error': false},
		{'code': 'print cross [1 2 3] [4 5 6 7]', 'error': true},
	];
	processValidationTestCases(cases, logger, validateMaxLen);
};