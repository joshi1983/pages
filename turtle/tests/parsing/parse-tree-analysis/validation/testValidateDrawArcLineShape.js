import { processValidationTestCases } from './processValidationTestCases.js';
import { validateDrawArcLineShape } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateDrawArcLineShape.js';

export function testValidateDrawArcLineShape(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'drawArcLineShape [] 100', 'error': true},
		{'code': 'drawArcLineShape [0 0 "hi] 100', 'error': true},
		{'code': 'drawArcLineShape [0 0 penUp] 100', 'error': true},
		{'code': 'drawArcLineShape [0 0 [penUp]] 100', 'error': true},
		{'code': 'drawArcLineShape [0 0 [[90 1] penUp]] 100', 'error': true},
		{'code': 'drawArcLineShape [0 0 []] 100', 'error': true},
		{'code': 'drawArcLineShape [0 0 [[90 0]]] 100', 'error': true},
		{'code': 'drawArcLineShape [0 0 [[1] [90 0] [1]]] 100', 'error': false},
		{'code': 'drawArcLineShape [0 0 [[0.5] [-90 0] [1]]] 100', 'error': false},
		{'code': 'drawArcLineShape ["hi 0 [[1] [90 0] [1]]] 100', 'error': true},
		{'code': 'drawArcLineShape [0 "world [[1] [90 0] [1]]] 100', 'error': true},
	];
	processValidationTestCases(cases, logger, validateDrawArcLineShape);
};