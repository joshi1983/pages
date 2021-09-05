import { processShapeConvertTestCases } from './processShapeConvertTestCases.js';
import { TextShape } from '../../../../modules/drawing/vector/shapes/TextShape.js';
import { textToX3D } from '../../../../modules/drawing/drawers/x3d/textToX3D.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testTextToX3D(logger) {
	const cases = [
		{'shape': new TextShape(new Vector3D(0, 0, 0), 0, 'hello'), 'substringChecks': ['"hello"']},
		{'shape': new TextShape(new Vector3D(0, 0, 0), Math.PI, 'hello'), 'substringChecks': ['"hello"']},
		{'shape': new TextShape(new Vector3D(0, 0, 0), 0, 'said, "world'), 'substringChecks': ['said, \\"world"']}
	];

	processShapeConvertTestCases(cases, textToX3D, logger);
};