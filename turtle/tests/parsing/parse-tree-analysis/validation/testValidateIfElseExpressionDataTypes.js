import { processValidationTestCase } from './processValidationTestCase.js';
import { validateIfElseExpressionDataTypes } from '../../../../modules/parsing/parse-tree-analysis/validation/validateIfElseExpressionDataTypes.js';

export function testValidateIfElseExpressionDataTypes(logger) {
	const cases = [
		{'code': 'fd "hi', 'error': false},
		// invalid but not something this validator should complain about.
		
		{'code': 'ifelse 1 < 3 [ print "hi] [print "yo]', 'error': false},
		{'code': 'print ifelse 1 < 3 "hi "yo', 'error': false},
		{'code': 'print 4 + ifelse 1 < 3 2 5', 'error': false},
		{'code': 'print - ifelse 1 < 3 2 5', 'error': false},
		{'code': 'fd ifelse 1 < 3 "hi "yo', 'error': false},
		// invalid types but validateDataTypes2 would handle the case.

		{'code': 'fd ifelse 1 < 3 5 "yo', 'error': true},
		{'code': 'fd ifelse 1 < 3 "hi 5', 'error': true},
		{'code': 'print 4 + ifelse 1 < 3 2 "hi', 'error': true},
		{'code': 'print - ifelse 1 < 3 2 "hi', 'error': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateIfElseExpressionDataTypes);
	});
};