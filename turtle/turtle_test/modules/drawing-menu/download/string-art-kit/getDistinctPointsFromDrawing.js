import { getPointsFromShape } from './getPointsFromShape.js';
import { LineSegmentShape } from '../../../drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from '../../../drawing/vector/shapes/PathShape.js';

/*
Returns an Array of Vector2D where no 2 points are closer than an error tolerance.
*/
export function getDistinctPointsFromDrawing(drawing) {
	const shapes = drawing.getShapesArray().
		filter(s => s instanceof LineSegmentShape || s instanceof PathShape);
	const result = [];
	const resultSet = new Set();
	for (let i = 0; i < shapes.length; i++) {
		const shapePoints = getPointsFromShape(shapes[i]);
		for (let j = 0; j < shapePoints.length; j++) {
			const point = shapePoints[j];
			const id = '' + point.getX() + ',' + point.getY();
			if (!resultSet.has(id)) {
				resultSet.add(id);
				result.push(point);
			}
		}
	}

	return result;
};