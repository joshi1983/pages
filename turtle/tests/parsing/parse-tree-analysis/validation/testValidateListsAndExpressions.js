import { processValidationTestCases } from './processValidationTestCases.js';
import { validateListsAndExpressions } from '../../../../modules/parsing/parse-tree-analysis/validation/validateListsAndExpressions.js';

export function testValidateListsAndExpressions(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'print [1 2]', 'error': false},
		{'code': 'print [1 2', 'error': true},
		{'code': 'print (1+2)', 'error': false},
		{'code': 'print (1+2', 'error': true},
		{'code': 'print [-1 2]', 'error': false},
		{'code': 'make "x 4\nprint [-:x 2]', 'error': false}
	];
	processValidationTestCases(cases, logger, validateListsAndExpressions);
};