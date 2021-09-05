import { processShapeConvertTestCases } from './processShapeConvertTestCases.js';
import { SphereShape } from '../../../../modules/drawing/vector/shapes/SphereShape.js';
import { sphereToX3D } from '../../../../modules/drawing/drawers/x3d/sphereToX3D.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testSphereToX3D(logger) {
	const cases = [
		{'shape': new SphereShape(new Vector3D(0, 0, 0), 100), 'substringChecks': ['"100"']},
	];

	processShapeConvertTestCases(cases, sphereToX3D, logger);
};