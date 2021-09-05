import { processValidationTestCases } from './processValidationTestCases.js';
import { validateSwapCalls } from '../../../../modules/parsing/parse-tree-analysis/validation/validateSwapCalls.js';

export function testValidateSwapCalls(logger) {
	const cases = [
		{'code': 'make "x 0 make "y 1', 'error': false},
		{'code': 'make "x 0 make "y 1 swap "x "y', 'error': false},
		{'code': 'make "x 0 make "y 1 swap "X "Y', 'error': false},
		{'code': 'to p\nmake "x 0 make "y 1 swap "X "Y\nend', 'error': false},
		{'code': 'to p\nlocalmake "x 0 localmake "y 1 swap "X "Y\nend', 'error': false},
		{'code': 'make "x 0 make "y 1 swap "x "z', 'error': true},
		{'code': 'make "x 0 make "y 1 swap "z "y', 'error': true},
		{'code': 'make "x 0 swap "x "x', 'error': true},
		{'code': 'make "x 0 swap "x "X', 'error': true},
		{'code': 'swap [] []', 'error': true},
		{'code': 'swap [] :y', 'error': true},
		{'code': 'make "x 0\nswap :x []', 'error': true},
		{'code': 'make "x 0\nswap :x createPList', 'error': true},
		{'code': 'swap :x :y', 'error': true},
	];
	processValidationTestCases(cases, logger, validateSwapCalls);
};