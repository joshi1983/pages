import { ArcShape } from '../../../vector/shapes/ArcShape.js';

export function reverseElements(elements) {
	elements.reverse();
	for (let i = 0; i < elements.length; i++) {
		const e = elements[i];
		if (e instanceof ArcShape) {
			const arc = e.deepClone();
			// deep cloned to avoid mutating the caller's shapes
			arc.swapArcDirection();
			elements[i] = arc;
		}
	}
};