import { ArrayUtils } from '../../../../ArrayUtils.js';
import { equalWithinThreshold } from '../../../../equalWithinThreshold.js';

const halfPi = Math.PI / 2;
const radianAngleThreshold = 0.0001;

function getDownLeftIndex(elements) {
	let result;
	let min;
	for (let i = 0; i < elements.length; i++) {
		const e = elements[i];
		const downLeftValue = e.getX() + e.getY();
		if (result === undefined || min > downLeftValue) {
			result = i;
			min = downLeftValue;
		}
	}
	return result;
}

function rotateElements(elements) {
	// get index of point that is most in a down-left direction.
	const index = getDownLeftIndex(elements);
	elements = elements.slice(0); // clone to avoid mutating the array.
	ArrayUtils.rotateLeft(elements, index);
	return elements;
}

export function getTransformInfo(elements) {
	elements = rotateElements(elements);
	let directionVector = elements[1].minus(elements[0]);
	let rotationRadians = Math.atan2(directionVector.getY(), directionVector.getX());
	const directionVector2 = elements[2].minus(elements[1]);
	let rotationRadians2 = Math.atan2(directionVector2.getY(), directionVector2.getX());
	if (rotationRadians2 < rotationRadians) {
		//ArrayUtils.rotateLeft(elements, 1);
		elements.reverse();
		directionVector = elements[1].minus(elements[0]);
		rotationRadians = Math.atan2(directionVector.getY(), directionVector.getX());
	}
	if (equalWithinThreshold(rotationRadians, halfPi, radianAngleThreshold)) {
		ArrayUtils.rotateRight(elements, 1);
		directionVector = elements[1].minus(elements[0]);
		rotationRadians = Math.atan2(directionVector.getY(), directionVector.getX());
	}
	return {
		'elements': elements,
		'rotationRadians': rotationRadians
	};
};