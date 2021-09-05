import { ArcShape } from '../../../vector/shapes/ArcShape.js';
import { ArrayUtils } from '../../../../ArrayUtils.js';

function getDownLeftIndex(elements) {
	let result;
	let min;
	for (let i = 0; i < elements.length; i++) {
		let e = elements[i];
		if (!(e instanceof ArcShape))
			continue;
		e = e.position;
		const downLeftValue = e.getX() + e.getY();
		if (result === undefined || min > downLeftValue) {
			result = i;
			min = downLeftValue;
		}
	}
	return result;
}

function rotateElements(elements) {
	elements = elements.slice(0);
	const index = getDownLeftIndex(elements);
	ArrayUtils.rotateLeft(elements, index);
	return elements;
}

export function getTransformInfo(path) {
	const elements = rotateElements(path.elements);
	return {
		'elements': elements
	};
};