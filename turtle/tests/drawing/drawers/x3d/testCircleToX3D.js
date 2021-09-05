import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { circleToX3D } from '../../../../modules/drawing/drawers/x3d/circleToX3D.js';
import { processShapeConvertTestCases } from './processShapeConvertTestCases.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testCircleToX3D(logger) {
	const cases = [
		{'shape': new CircleShape(new Vector3D(0, 0, 0), 100), 'substringChecks': ['"100"']},
	];

	processShapeConvertTestCases(cases, circleToX3D, logger);
};