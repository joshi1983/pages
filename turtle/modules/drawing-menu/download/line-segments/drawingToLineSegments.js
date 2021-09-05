import { ArrayUtils } from '../../../ArrayUtils.js';
import { ColouredLineSegment } from './ColouredLineSegment.js';
import { LineSegmentShape } from '../../../drawing/vector/shapes/LineSegmentShape.js';
import { lineSegmentShapeToColouredLineSegment } from './lineSegmentShapeToColouredLineSegment.js';
import { PathShape } from '../../../drawing/vector/shapes/PathShape.js';
import { styleToColour } from '../styleToColour.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

function pathToLineSegments(path) {
	const elements = path.elements;
	const result = [];
	for (let i = 1; i < elements.length; i++) {
		const element = elements[i];
		let prev = elements[i - 1];
		if (typeof prev.getEndPoint === 'function')
			prev = prev.getEndPoint();
		if (element instanceof Vector3D) {
			result.push(new ColouredLineSegment(prev, element, styleToColour(path.style)));
		}
		else
			ArrayUtils.pushAll(result, shapeToLineSegments(element));
	}
	return result;
}

function shapeToLineSegments(shape) {
	if (shape instanceof PathShape)
		return pathToLineSegments(shape);
	if (shape instanceof LineSegmentShape)
		return [lineSegmentShapeToColouredLineSegment(shape)];
	const result = [];
	return result;
}

export function drawingToLineSegments(drawing) {
	const shapes = drawing.getShapesArray();
	const result = [];
	for (let i = 0; i < shapes.length; i++) {
		ArrayUtils.pushAll(result, shapeToLineSegments(shapes[i]));
	}
	return result;
};