import { processValidationTestCases } from './processValidationTestCases.js';
import { validateOverwrittenParameters } from '../../../../modules/parsing/parse-tree-analysis/validation/validateOverwrittenParameters.js';

export function testValidateOverwrittenParameters(logger) {
	const cases = [
		{'code': '', 'warn': false, 'error': false},
		{'code': 'to p\nend\n', 'warn': false, 'error': false},
		{'code': 'to p :size\nend\n', 'warn': false, 'error': false},
		// size is never read so it should not get this particular warning.
		// Another validator should warn for this code.

		{'code': 'to p :size\nlocalmake "size :size * 2\nprint :size\nend\n', 'warn': false, 'error': false},
		{'code': 'to p :size\nlocalmake "size 5\nprint :size\nend\n', 'warn': true, 'error': false},
		{'code': 'to p :size\nrepeat 5 [\nprint :size\nlocalmake "size 5]\nprint :size\nend\n', 'warn': false, 'error': false},
		{'code': 'to p :size\nrepeat 5 [\nif repcount=1 [\nprint :size\n]\nlocalmake "size 5]\nprint :size\nend\n', 'warn': false, 'error': false},
	];
	processValidationTestCases(cases, logger, validateOverwrittenParameters);
};