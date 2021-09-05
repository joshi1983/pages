import { BoundingBox2D } from '../../../modules/drawing/vector/BoundingBox2D.js';
import { Vector2D } from '../../../modules/drawing/vector/Vector2D.js';

export function testBoundingBox2D(logger) {
	new BoundingBox2D();
	new BoundingBox2D([]);
	const box = new BoundingBox2D([new Vector2D(0, 0), new Vector2D(0, 150), new Vector2D(100, 100)]);
	if (box.min.getX() !== 0)
		logger(`min x expected to be 0 but got ${box.min.getX()}`);
	if (box.min.getY() !== 0)
		logger(`min y expected to be 0 but got ${box.min.getY()}`);
	if (box.max.getX() !== 100)
		logger(`max x expected to be 100 but got ${box.max.getX()}`);
	if (box.max.getY() !== 150)
		logger(`max y expected to be 150 but got ${box.max.getY()}`);

	const a = box.getAverageDimension();
	if (a !== 125)
		logger(`Expected to be 125 but got ${a}`);
	const radius = box.getRadius();
	if (typeof radius !== 'number' || isNaN(radius))
		logger('Expected a number from getRadius() but got ' + radius);
};