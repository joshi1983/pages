import { processValidationTestCase } from './processValidationTestCase.js';
import { validateConsecutiveCommands } from '../../../../modules/parsing/parse-tree-analysis/validation/validateConsecutiveCommands.js';

export function testValidateConsecutiveCommands(logger) {
	const cases = [
		/*{'code': '', 'error': false},
		{'code': 'fd 100', 'error': false},
		{'code': 'forward 100', 'error': false},*/
		{'code': 'fd 100 fd 150', 'error': false, 'warn': true},
		{'code': 'forward 100 forward 150', 'error': false, 'warn': true},
		{'code': 'fd 100 forward 150', 'error': false, 'warn': true},
		{'code': 'forward 100 setpensize 10 forward 150', 'error': false, 'warn': false},
		{'code': 'right 50 left 25', 'error': false, 'warn': true},
		{'code': 'fd 50 back 25', 'error': false, 'warn': false},
		// No warning expected.
		// Even if the new turtle position can be found with a single fd 25, "fd 25" won't have the larger effect of drawing the line of 50 length.

		{'code': 'to p\nprint "hi output 10\nend\n fd p\nfd 10', 'error': false, 'warn': false}, 
		// since calling p has a side effect, don't warn.  
		// It might be harder to combine command calls when side effects are caused by evaluating their inputs.
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateConsecutiveCommands);
	});

};