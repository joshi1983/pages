import { processValidationTestCases } from './processValidationTestCases.js';
import { validateDrawArcLineShapes } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateDrawArcLineShapes.js';

export function testValidateDrawArcLineShapes(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'drawArcLineShapes [] 100', 'error': false, 'warn': true},
		{'code': 'drawArcLineShapes [penUp] 100', 'error': true},
		{'code': 'drawArcLineShapes [[0 0 "hi]] 100', 'error': true},
		{'code': 'drawArcLineShapes [[0 0 penUp]] 100', 'error': true},
		{'code': 'drawArcLineShapes [[0 0 []]] 100', 'error': true},
		{'code': 'drawArcLineShapes [[0 0 [[90 0]]]] 100', 'error': true},
		{'code': 'drawArcLineShapes [[0 0 [[90 0] penUp]]] 100', 'error': true},
		{'code': 'drawArcLineShapes [[0 0 [[90 1] penUp]]] 100', 'error': true},
		{'code': 'drawArcLineShapes [[0 0 [[1] [90 0] [1]]]] 100', 'error': false},
		{'code': 'drawArcLineShapes [[0 0 [[0.5] [-90 0] [1]]]] 100', 'error': false},
		{'code': 'drawArcLineShapes [["hi 0 [[1] [90 0] [1]]]] 100', 'error': true},
		{'code': 'drawArcLineShapes [[0 "world [[1] [90 0] [1]]]] 100', 'error': true},
	];
	processValidationTestCases(cases, logger, validateDrawArcLineShapes);
};