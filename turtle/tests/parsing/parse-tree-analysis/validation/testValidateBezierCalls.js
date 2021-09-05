import { processValidationTestCase } from './processValidationTestCase.js';
import { validateBezierCalls } from '../../../../modules/parsing/parse-tree-analysis/validation/validateBezierCalls.js';

export function testValidateBezierCalls(logger) {
	const cases = [
		{'code': 'make "x bezier [[1 2] [3 4]] 0.5', 'error': false},
		{'code': 'make "x bezier [1 2] 0.5', 'error': true},
		{'code': 'make "x bezier [["1 2] [3 4]] 0.5', 'error': true},
		{'code': 'make "x bezier [[1 2] [3 4 5]] 0.5', 'error': true}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateBezierCalls);
	});
};