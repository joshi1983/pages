import { ArrayUtils } from '../../../ArrayUtils.js';
import { PathShape } from '../../../drawing/vector/shapes/PathShape.js';
import { PointCloudPoint } from './PointCloudPoint.js';
import { shapeToColour } from '../shapeToColour.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

function pathToPoints(path) {
	const elements = path.elements;
	const result = [];
	const colour = shapeToColour(path);
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		if (element instanceof Vector3D)
			result.push(new PointCloudPoint(element, colour));
		else
			ArrayUtils.pushAll(result, shapeToPoints(element));
	}
	return result;
}

function shapeToPoints(shape) {
	if (shape instanceof PathShape)
		return pathToPoints(shape);
	const result = [];
	const colour = shapeToColour(shape);
	if (typeof shape.getStartPoint === 'function')
		result.push(new PointCloudPoint(shape.getStartPoint(), colour));
	if (typeof shape.getEndPoint === 'function')
		result.push(new PointCloudPoint(shape.getEndPoint(), colour));
	if (result.length === 0)
		result.push(new PointCloudPoint(shape.position, colour));
	return result;
}

export function drawingToPoints(drawing) {
	const shapes = drawing.getShapesArray();
	const result = [];
	for (let i = 0; i < shapes.length; i++) {
		ArrayUtils.pushAll(result, shapeToPoints(shapes[i]));
	}
	return result;
};