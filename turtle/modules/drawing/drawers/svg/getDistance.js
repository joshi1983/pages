import { Vector } from '../../vector/Vector.js';

export function getDistance(from, to) {
	if (from.getEndPoint !== undefined)
		from = from.getEndPoint();
	if (to.getStartPoint !== undefined)
		to = to.getStartPoint();
	const diff = from.minus(to);
	return Vector.euclideanDistance(diff);
};