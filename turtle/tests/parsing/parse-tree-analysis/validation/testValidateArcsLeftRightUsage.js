import { processValidationTestCases } from './processValidationTestCases.js';
import { validateArcsLeftRightUsage } from '../../../../modules/parsing/parse-tree-analysis/validation/validateArcsLeftRightUsage.js';

export function testValidateArcsLeftRightUsage(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'arcsLeft "hi 4', 'error': false, 'warn': false},
		// another validator will handle this case so extra error 
		// messages will only be extra noise.
		{'code': 'arcsLeft [["1 "g]] 4', 'error': false},
		{'code': 'arcsLeft [["1 "4]] 4', 'error': false},
		// Just some more cases that would be handled by another validator.

		{'code': 'arcsLeft [[1 2]] 4', 'error': false, 'warn': false},
		{'code': 'arcsLeft [[-1 2]] 4', 'error': false, 'warn': false},
		{'code': 'arcsLeft [[1 0]] 4', 'error': false, 'warn': false},
		{'code': 'arcsLeft [] 4', 'error': false, 'warn': true},
		{'code': 'arcsLeft [[]] 4', 'error': true},
		{'code': 'arcsLeft [[1]] 4', 'error': true},
		{'code': 'arcsLeft [[1 2 3]] 4', 'error': true},
	];

	processValidationTestCases(cases, logger, validateArcsLeftRightUsage);
};