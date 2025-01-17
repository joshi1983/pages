import { processValidationTestCases } from './processValidationTestCases.js';
import { validateBreakCommand } from '../../../../modules/parsing/parse-tree-analysis/validation/validateBreakCommand.js';

export function testValidateBreakCommand(logger) {
	const cases = [
		{'code': 'do.while [break] true', 'error': false},
		{'code': 'while true [break]', 'error': false},
		{'code': 'forever [break]', 'error': false},
		{'code': 'for ["i 0 5] [break]', 'error': false},
		{'code': 'repeat 2 [break]', 'error': false},

		{'code': 'for ["i 0 3] [print "yo break print "yay] print "hi', 'error': false, 'warn': true},
		// warn that the print "yay is unreachable.
		{'code': 'repeat 2 [print "yo break print "yay] print "hi', 'error': false, 'warn': true},
		{'code': 'do.while [print "yo break print "yay] true print "hi', 'error': false, 'warn': true},
		{'code': 'while true [print "yo break print "yay] print "hi', 'error': false, 'warn': true},
		{'code': 'until false [print "yo break print "yay] print "hi', 'error': false, 'warn': true},

		{'code': 'break', 'error': true},
		{'code': 'to f\nbreak\nend', 'error': true},
	];
	processValidationTestCases(cases, logger, validateBreakCommand);
};