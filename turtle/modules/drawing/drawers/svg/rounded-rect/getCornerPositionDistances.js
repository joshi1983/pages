import { ArcShape } from '../../../vector/shapes/ArcShape.js';
import { Vector } from '../../../vector/Vector.js';

export function getCornerPositionDistances(elements) {
	const result = [];
	let prevPos;
	for (let i = 0; i < elements.length; i++) {
		const e = elements[i];
		if (e instanceof ArcShape) {
			if (prevPos !== undefined) {
				const distance = Vector.euclideanDistance(prevPos.minus(e.position));
				result.push(distance);
			}
			prevPos = e.position;
		}
	}
	return result;
};