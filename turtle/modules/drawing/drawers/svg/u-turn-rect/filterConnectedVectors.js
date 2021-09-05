import { ArcShape } from '../../../vector/shapes/ArcShape.js';
import { Vector3D } from '../../../vector/Vector3D.js';

export function filterConnectedVectors(elements) {
	const result = [];
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		if (element instanceof Vector3D) {
			if (i !== 0) {
				const prev = elements[i - 1];
				if (prev instanceof ArcShape &&
				prev.getEndPoint().equalsCloseEnough(element))
					continue;
			}
			const next = elements[(i + 1) % elements.length];
			if (next instanceof ArcShape &&
			next.getStartPoint().equalsCloseEnough(element))
				continue;
		}
		result.push(element);
	}
	return result;
};