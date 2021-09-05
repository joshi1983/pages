import { CylinderShape } from '../../../../modules/drawing/vector/shapes/CylinderShape.js';
import { cylinderToX3D } from '../../../../modules/drawing/drawers/x3d/cylinderToX3D.js';
import { processShapeConvertTestCases } from './processShapeConvertTestCases.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testCylinderToX3D(logger) {
	const cases = [
		{'shape': new CylinderShape(new Vector3D(0, 0, 0), new Vector3D(100, 0, 0), 20), 'substringChecks': []},
	];

	processShapeConvertTestCases(cases, cylinderToX3D, logger);
};