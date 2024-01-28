import { ArcShape } from '../../../vector/shapes/ArcShape.js';
import { isNumber } from '../../../../isNumber.js';
import { Vector } from '../../../vector/Vector.js';

function isCloseEnoughPair(e1, e2, errorThreshold) {
	if (e1 instanceof Vector) {
		if (!(e2 instanceof Vector)) {
			const startPos = e2.getStartPoint();
			if (Vector.coordsEqualEnough(startPos.coords, e1.coords, errorThreshold))
				return true;
		}
	}
	return true;
}

function isCloseEnoughTriple(e1, middle, e3, errorThreshold) {
	if (!(middle instanceof Vector))
		return true;
	if (isCloseEnoughPair(middle, e3, errorThreshold))
		return true;
	if (e1 instanceof Vector)
		return false; 
	// not really a problem with proximity but adjacent elements must be of different type.

	return Vector.coordsEqualEnough(middle, e1.getEndPoint(), errorThreshold);
}

export function allStraightSegmentsConnectedToArcs(elements, errorThreshold) {
	if (!isNumber(errorThreshold))
		throw new Error(`errorThreshold must be a number but got ${errorThreshold}`);
	if (!isCloseEnoughTriple(elements[elements.length - 1], elements[0], elements[1], errorThreshold))
		return false;
	if (!isCloseEnoughTriple(elements[elements.length - 2], elements[elements.length - 1], elements[0], errorThreshold))
		return false;
	if (elements[elements.length - 1] instanceof ArcShape &&
	!(elements[0] instanceof ArcShape) &&
	elements[1] instanceof ArcShape) {
		const endPoint = elements[elements.length - 1].getEndPoint();
		const startPoint = elements[0];
		const secondPoint = elements[1].getStartPoint();
		if (!Vector.coordsEqualEnough(endPoint.coords, startPoint.coords, errorThreshold) &&
		!Vector.coordsEqualEnough(startPoint.coords, secondPoint.coords, errorThreshold))
			return false;
	}
	for (let i = 1; i < elements.length - 1; i++) {
		const e = elements[i];
		if (e instanceof Vector) {
			if (!isCloseEnoughTriple(elements[i - 1], e, elements[i + 1], errorThreshold))
				return false;
		}
	}
	return true;
};