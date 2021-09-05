import { CircleShape } from '../../shapes/CircleShape.js';
import { isCircleHidingCircle } from './isCircleHidingCircle.js';

export function isCircleHidingArc(circle, arc) {
	const arcCircle = new CircleShape(arc.position, arc.radius, arc.style);
	if (isCircleHidingCircle(circle, arcCircle))
		return true;
	return false;
};