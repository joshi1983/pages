import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { CylinderShape } from '../../../../modules/drawing/vector/shapes/CylinderShape.js';
import { processShapeConvertTestCases } from './processShapeConvertTestCases.js';
import { shapeToX3D } from '../../../../modules/drawing/drawers/x3d/shapeToX3D.js';
import { SphereShape } from '../../../../modules/drawing/vector/shapes/SphereShape.js';
import { TextShape } from '../../../../modules/drawing/vector/shapes/TextShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testShapeToX3D(logger) {
	const cases = [
		{'shape': new CircleShape(new Vector3D(0, 0, 0), 100), 'substringChecks': []},
		{'shape': new CylinderShape(new Vector3D(0, 0, 0), new Vector3D(100, 0, 0), 20), 'substringChecks': []},
		{'shape': new TextShape(new Vector3D(0, 0, 0), 0, 'hello'), 'substringChecks': ['"hello"']},
		{'shape': new SphereShape(new Vector3D(0, 0, 0), 100), 'substringChecks': ['"100"']},
	];

	processShapeConvertTestCases(cases, shapeToX3D, logger);
};