import { processValidationTestCase } from './processValidationTestCase.js';
import { validateBreakCommand } from '../../../../modules/parsing/parse-tree-analysis/validation/validateBreakCommand.js';

export function testValidateBreakCommand(logger) {
	const cases = [
		{'code': 'do.while [break] true', 'error': false},
		{'code': 'while true [break]', 'error': false},
		{'code': 'forever [break]', 'error': false},
		{'code': 'for ["i 0 5] [break]', 'error': false},
		{'code': 'repeat 2 [break]', 'error': false},
		{'code': 'break', 'error': true},
		{'code': 'to f\nbreak\nend', 'error': true}
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateBreakCommand);
	});
};