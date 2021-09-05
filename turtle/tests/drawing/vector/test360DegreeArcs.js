import { createDrawingFromCode } from '../../helpers/createDrawingFromCode.js';
import { PathShape } from '../../../modules/drawing/vector/shapes/PathShape.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function noZeroAngleArcsInPaths(shapes, logger) {
	shapes.forEach(function(shape, shapeIndex) {
		if (!(shape instanceof PathShape))
			return;
		const path = shape;
		path.elements.forEach(function(element, elementIndex) {
			if (element.angle === 0)
				logger(`No Path should contain an arc with angle 0 but one found at index ${elementIndex}, shape index ${shapeIndex}`);
		});
	});
}

export function test360DegreeArcs(logger) {
	const cases = [
	{
		'code': `polyStart
arcRight 360 10
polyEnd`,
		'numShapes': 1,
		'shapeTypes': [
			'CircleShape'
		]
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const drawing = createDrawingFromCode(caseInfo.code, plogger);
		const shapes = drawing.getShapesArray();
		noZeroAngleArcsInPaths(shapes, plogger);
		if (shapes.length !== caseInfo.numShapes)
			plogger(`Expected number of shapes to be ${caseInfo.numShapes} but got ${shapes.length}, type names were ${shapes.map(s => s.constructor.name).join(', ')}`);
		else if (caseInfo.shapeTypes !== undefined) {
			caseInfo.shapeTypes.forEach(function(shapeType, index) {
				const shape = shapes[index];
				if (shape.constructor.name !== shapeType) {
					plogger(`Expected ${shapeType} but got ${shape.constructor.name}`);
				}
			});
		}
	});
};