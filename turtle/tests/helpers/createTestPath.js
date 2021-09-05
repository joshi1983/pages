import { PathShape } from '../../modules/drawing/vector/shapes/PathShape.js';
import { Vector2D } from '../../modules/drawing/vector/Vector2D.js';

export function createTestPath(logger) {
	const points = [];
	for (let i = 0; i < 3; i++) {
		points.push(new Vector2D(i, 5 * (i % 2)));
	}
	return new PathShape(points, false);
};