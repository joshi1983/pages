import { ArcShape } from '../../../vector/shapes/ArcShape.js';

export function getDistinctArcCenterPositions(elements) {
	const result = [];
	for (const element of elements) {
		if (element instanceof ArcShape) {
			const pos = element.position;
			if (!result.some(previousPos => previousPos.equalsCloseEnough(pos))) {
				result.push(pos);
			}
		}
	};
	return result;
};