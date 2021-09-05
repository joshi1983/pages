import { processValidationTestCases } from './processValidationTestCases.js';
import { validateDistinctForLoopVariableNames } from '../../../../modules/parsing/parse-tree-analysis/validation/validateDistinctForLoopVariableNames.js';

export function testValidateDistinctForLoopVariableNames(logger) {
	const cases = [
	{'code': '', 'warn': false, 'error': false},
	{'code': 'for ["x 1 5 1] [print :x]', 'warn': false, 'error': false},
	{'code': 'make "x 1 for ["x 1 5 1] [print :x]', 'warn': true, 'error': false}
	];
	processValidationTestCases(cases, logger, validateDistinctForLoopVariableNames);
};