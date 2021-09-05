import { ArrayUtils } from '../../../../ArrayUtils.js';
import { BoundingBox2D } from '../../BoundingBox2D.js';
import { getIntersectionPoints } from './getIntersectionPoints.js';
import { isContainingPoint } from './isContainingPoint.js';
import { rectToPoints } from './rectToPoints.js';
import { SimpleRect2D } from './SimpleRect2D.js';
import { Vector2D } from '../../Vector2D.js';

function pointsToRect(points) {
	const box = new BoundingBox2D(points);
	return new SimpleRect2D(box.min.getX(), box.min.getY(),
		box.max.getX() - box.min.getX(), box.max.getY() - box.min.getY(), 0);
}

function getErrorThreshold(rect1, rect2) {
	return Math.min(rect1.width, rect1.height, rect2.width, rect2.height) / 10000;
}

/*
rect1 and rect2 should be instances of SimpleRect.

If there is no intersection, returns undefined.
If there is an intersection, returns a SimpleRect that
- overlaps the intersected area
- matches rect1's headingRadians
- is not larger than otherwise needed.
*/
export function getRectIntersection(rect1, rect2) {
	const original = rect1.clone();
	rect2 = rect2.clone();
	rect1 = rect1.clone();
	rect1.x = 0;
	rect1.y = 0;
	rect1.headingRadians = 0;
	rect2.x -= original.x;
	rect2.y -= original.y;
	rect2.headingRadians -= original.headingRadians;
	const rect2Rotated = Vector2D.rotate(new Vector2D(rect2.x, rect2.y), -original.headingRadians);
	rect2.x = rect2Rotated.getX();
	rect2.y = rect2Rotated.getY();

	const errorThreshold = getErrorThreshold(rect1, rect2);
	const resultPoints = rectToPoints(rect1).filter((v) => isContainingPoint(rect2, v, errorThreshold));
	ArrayUtils.pushAll(resultPoints, rectToPoints(rect2).filter((v) => isContainingPoint(rect1, v, errorThreshold)));
	ArrayUtils.pushAll(resultPoints, getIntersectionPoints(rect1, rect2, errorThreshold));
	/*
	FIXME: add points that may intersect either rectangle.
	*/
	if (resultPoints.length !== 0) {
		const result = pointsToRect(resultPoints);
		if (result !== undefined && result.width > errorThreshold && result.height > errorThreshold) {
			const rotatedP = Vector2D.rotate(new Vector2D(result.x, result.y), original.headingRadians);
			result.headingRadians = original.headingRadians;
			result.x = rotatedP.getX() + original.x;
			result.y = rotatedP.getY() + original.y;
			result.sourcePoints = resultPoints.map(p => Vector2D.rotate(p, original.headingRadians).plus(new Vector2D(original.x, original.y)));
			return result;
		}
	}
};