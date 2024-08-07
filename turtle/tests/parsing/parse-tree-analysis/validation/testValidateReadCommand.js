import { processValidationTestCases } from './processValidationTestCases.js';
import { validateReadCommand } from '../../../../modules/parsing/parse-tree-analysis/validation/validateReadCommand.js';

export function testValidateReadCommand(logger) {
	const cases = [
		{'code': '', 'error': false, 'warn': false},
		{'code': 'fd 1', 'error': false, 'warn': false},
		{'code': 'setFillColor "red', 'error': false, 'warn': false},
		{'code': 'setFillColor fillColor', 'error': false, 'warn': true},
		{'code': 'setfillcolor fillcolor', 'error': false, 'warn': true}
	];
	processValidationTestCases(cases, logger, validateReadCommand);
};