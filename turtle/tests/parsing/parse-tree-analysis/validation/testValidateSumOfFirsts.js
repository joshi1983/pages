import { processValidationTestCases } from './processValidationTestCases.js';
import { validateSumOfFirsts } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateSumOfFirsts.js';

export function testValidateSumOfFirsts(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'print sumOfFirsts []', 'error': false},
		{'code': 'print sumOfFirsts [[1]]', 'error': false},
		{'code': 'print sumOfFirsts [[1] [2]]', 'error': false},
		{'code': 'print sumOfFirsts [[1 2] [2 3 4]]', 'error': false},
		{'code': 'print sumOfFirsts [[1 "hi] [2 "bye]]', 'error': false},
		{'code': 'print sumOfFirsts [[]]', 'error': true},
		{'code': 'print sumOfFirsts [[1 "hi] ["bye]]', 'error': true},
		{'code': 'print sumOfFirsts [[1 "hi] [3] []]', 'error': true},
	];

	processValidationTestCases(cases, logger, validateSumOfFirsts);
};