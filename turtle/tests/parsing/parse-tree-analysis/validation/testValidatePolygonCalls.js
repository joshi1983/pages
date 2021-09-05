import { processValidationTestCases } from './processValidationTestCases.js';
import { validatePolygonCalls } from
'../../../../modules/parsing/parse-tree-analysis/validation/validatePolygonCalls.js';

export function testValidatePolygonCalls(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'polygon [[0 100] [100 100] [100 0]]', 'error': false},
		{'code': 'polygon [[0 100 0] [100 100 0] [100 0 0]]', 'error': false},
		{'code': 'polygon [[] [100 100 0] [100 0 0]]', 'error': true},
		{'code': 'polygon [[0 100 0] [100 100 0] []]', 'error': true},
		{'code': 'polygon [[0 100 0] [100 100 0] [1 2 3 4]]', 'error': true},
		{'code': 'make "x [0 100]\npolygon [:x [100 100 0] [100 0 0]]', 'error': false},
		{'code': 'make "x [1 2 3 4]\npolygon [:x [100 100 0] [100 0 0]]', 'error': true},
		{'code': 'make "x [1 2 3 4]\npolygon [:x pos [100 0 0]]', 'error': true},
	];
	processValidationTestCases(cases, logger, validatePolygonCalls);
};