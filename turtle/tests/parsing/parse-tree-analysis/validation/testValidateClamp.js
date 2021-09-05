import { processValidationTestCases } from './processValidationTestCases.js';
import { validateClamp } from '../../../../modules/parsing/parse-tree-analysis/validation/validateClamp.js';

export function testValidateClamp(logger) {
	const cases = [
		{'code': 'print clamp 1 2 3', 'warn': false, 'error': false},
		{'code': 'print clamp 1 2 2', 'warn': true, 'error': false},
		{'code': 'print clamp 1 3 2', 'warn': false, 'error': true}
	];
	processValidationTestCases(cases, logger, validateClamp);
};