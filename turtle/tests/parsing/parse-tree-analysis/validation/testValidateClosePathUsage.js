import { processValidationTestCases } from './processValidationTestCases.js';
import { validateClosePathUsage } from '../../../../modules/parsing/parse-tree-analysis/validation/validateClosePathUsage.js';

export function testValidateClosePathUsage(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'closePath', 'error': true},
		{'code': 'forward 100\nright 90\nforward 100\nclosePath', 'error': false}
	];
	processValidationTestCases(cases, logger, validateClosePathUsage);
};