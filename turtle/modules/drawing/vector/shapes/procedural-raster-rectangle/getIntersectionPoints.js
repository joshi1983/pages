import { isContainingPoint } from './isContainingPoint.js';
import { isNumber } from '../../../../isNumber.js';
import { rectToPoints } from './rectToPoints.js';
import { Vector2D } from '../../Vector2D.js';

function addIntersectionPoints(result, horizontalRect, dir, x, y) {
	if (typeof horizontalRect !== 'object')
		throw new Error(`horizontalRect must be a rectangle object but got ${horizontalRect}`);
	if (!isNumber(x))
		throw new Error(`x must be a number but got ${x}`);
	if (!isNumber(y))
		throw new Error(`y must be a number but got ${y}`);
	if (!(dir instanceof Vector2D))
		throw new Error(`dir must be a Vector2D but got ${dir}`);
	let scale;
	if (dir.getX() !== 0) {
		scale = x / dir.getX();
		result.push(new Vector2D(0, y - dir.getY() * scale));
		scale = (x - horizontalRect.width) / dir.getX();
		result.push(new Vector2D(horizontalRect.width, y - dir.getY() * scale));
	}
	if (dir.getY() !== 0) {
		scale = y / dir.getY();
		result.push(new Vector2D(x - dir.getX() * scale, 0));
		scale = (y - horizontalRect.height) / dir.getY();
		result.push(new Vector2D(x - dir.getX() * scale, horizontalRect.height));
	}
}

function getPossibleIntersectionPoints(rect1, rect2) {
	const result = [];
	// get point from rect2.x, rect2.y in rect2.headingRadians.
	const dirV1 = new Vector2D(Math.cos(rect2.headingRadians), Math.sin(rect2.headingRadians));
	const dirV2 = new Vector2D(-dirV1.getY(), dirV1.getX());
	const yIntercepts = [0, rect1.height];
	const xIntercepts = [0, rect1.width];
	const dirs = [dirV1, dirV2];
	const points = rectToPoints(rect2);
	dirs.forEach(function(dir) {
		points.forEach(function(p) {
			addIntersectionPoints(result, rect1, dir, p.getX(), p.getY());
		});
	});
	return result;
}

/*
Assumes rect1 has a headingRadians of 0.
Also, assumes rect1.x === 0 && rect2.y === 0.
*/
export function getIntersectionPoints(rect1, rect2, errorThreshold) {
	return getPossibleIntersectionPoints(rect1, rect2).filter(p =>
		isContainingPoint(rect1, p, errorThreshold) &&
		isContainingPoint(rect2, p, errorThreshold)
	);
};