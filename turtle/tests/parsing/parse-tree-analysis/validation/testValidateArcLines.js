import { processValidationTestCases } from './processValidationTestCases.js';
import { validateArcLines } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateArcLines.js';

export function testValidateArcLines(logger) {
	const cases = [
		{'code': 'arcLines [] 100', 'warn': true, 'error': false},
		{'code': 'arcLines [[90 0]] 100', 'warn': true, 'error': false},
		{'code': 'arcLines [[1]] 100', 'warn': false, 'error': false},
		{'code': 'arcLines [[-1]] 100', 'warn': false, 'error': false},
		{'code': 'arcLines [[90 1]] 100', 'warn': false, 'error': false},
		{'code': 'arcLines [[90 -1]] 100', 'error': true},
	];
	processValidationTestCases(cases, logger, validateArcLines);
};