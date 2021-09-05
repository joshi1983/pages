import { processValidationTestCases } from './processValidationTestCases.js';
import { validateDrawingGroupCommands } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateDrawingGroupCommands.js';

export function testValidateDrawingGroupCommands(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'fd 1', 'error': false},
		{'code': 'to animation.snapshotstyle\ndrawing.box\nend', 'error': false},
		{'code': 'drawing.box', 'error': true},
		{'code': 'drawing.Box', 'error': true},
		{'code': 'to animation.setup\ndrawing.box\nend', 'error': true},
	];
	processValidationTestCases(cases, logger, validateDrawingGroupCommands);
};