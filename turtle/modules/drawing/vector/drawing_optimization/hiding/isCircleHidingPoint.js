import { isFillOpaque } from
'./isFillOpaque.js';
import { isPenOpaque } from
'./isPenOpaque.js';
import { Vector } from
'../../Vector.js';

// circleShape should be an instance of CircleShape class.
export function isCircleHidingPoint(circleShape, pointCoords) {
	if (!(pointCoords instanceof Array))
		throw new Error(`pointCoords must be an Array but found ${pointCoords}`);
	if (pointCoords.length === 2)
		pointCoords[2] = circleShape.position.coords[2];

	const d = Vector.euclideanDistance(Vector.minusCoords(circleShape.position.coords, pointCoords));
	if (d <= circleShape.radius) {
		if (isFillOpaque(circleShape.style))
			return true;
	}
	const halfPenWidth = circleShape.style.getPenWidth() / 2;
	if (d >= circleShape.radius - halfPenWidth &&
	d <= circleShape.radius + halfPenWidth) {
		if (isPenOpaque(circleShape.style))
			return true;
	}
	return false;
};