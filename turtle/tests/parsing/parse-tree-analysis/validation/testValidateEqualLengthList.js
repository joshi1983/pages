import { processValidationTestCase } from './processValidationTestCase.js';
import { validateEqualLengthList } from '../../../../modules/parsing/parse-tree-analysis/validation/validateEqualLengthList.js';

export function testValidateEqualLengthList(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'fd 10', 'error': false},
		{'code': 'print dot [] []', 'error': false},
		{'code': 'print dot [1] [3]', 'error': false},
		{'code': 'print dot [1 2] [3 4]', 'error': false},
		{'code': 'make "x [random 10 random 20]\nprint dot :x [3 4]', 'error': false},
		{'code': 'print dot [1 2 3] [3 4]', 'error': true},
		{'code': 'make "x [1 2]\nprint dot :x [3]', 'error': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateEqualLengthList);
	});
};