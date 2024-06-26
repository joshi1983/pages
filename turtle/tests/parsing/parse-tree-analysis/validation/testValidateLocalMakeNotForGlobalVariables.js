import { validateLocalMakeNotForGlobalVariables } from '../../../../modules/parsing/parse-tree-analysis/validation/validateLocalMakeNotForGlobalVariables.js';
import { processValidationTestCases } from './processValidationTestCases.js';

export function testValidateLocalMakeNotForGlobalVariables(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'localmake "x 1', 'error': true},
		{'code': 'for ["x 1 5 1] [localmake "x 1]', 'error': true},
		{'code': 'to something\nlocalmake "x 1\nend', 'error': false},
		{'code': 'to something :x\nlocalmake "x 1\nend', 'error': false},
	];
	processValidationTestCases(cases, logger, validateLocalMakeNotForGlobalVariables);
};