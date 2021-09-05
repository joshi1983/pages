import { processValidationTestCases } from './processValidationTestCases.js';
import { validateEqualLengthList } from '../../../../modules/parsing/parse-tree-analysis/validation/validateEqualLengthList.js';

export function testValidateEqualLengthList(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'fd 10', 'error': false},
		{'code': 'print dotProduct [] []', 'error': false},
		{'code': 'print dotProduct [1] [3]', 'error': false},
		{'code': 'print dotProduct [1 2] [3 4]', 'error': false},
		{'code': `make "x [random 10 random 20]
print dotProduct :x [3 4]`, 'error': false},
		{'code': 'print dotProduct [1 2 3] [3 4]', 'error': true},
		{'code': 'make "x [1 2]\nprint dotProduct :x [3]', 'error': true},
	];
	processValidationTestCases(cases, logger, validateEqualLengthList);
};