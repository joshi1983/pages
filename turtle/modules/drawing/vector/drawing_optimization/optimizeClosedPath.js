import { ArcShape } from '../shapes/ArcShape.js';
import { mergeArcs } from './mergeArcs.js';
import { Vector } from '../Vector.js';
import { Vector3D } from '../Vector3D.js';

function getEndPoint(e) {
	if (e.getEndPoint === undefined)
		return e;
	else
		return e.getEndPoint();
}

function getStartPoint(e) {
	if (e.getStartPoint === undefined)
		return e;
	else
		return e.getStartPoint();
}

function roughPerimeter(elements) {
	let result = 0;
	for (let i = 1; i < elements.length; i++) {
		const p1 = getEndPoint(elements[i - 1]);
		const p2 = getStartPoint(elements[i]);
		const len = Vector.euclideanDistance(p1.minus(p2).coords);
		result += len;
	}
	return Math.max(0.1, result);
}

export function optimizeClosedPath(path) {
	const elements = path.elements;
	if (path.isClosed !== true || elements === undefined)
		return;
	const lastElement = elements[elements.length - 1];
	if (elements.length > 1 && elements[0] instanceof ArcShape &&
	lastElement instanceof ArcShape) {
		const mergedArc = mergeArcs(elements[0], lastElement);
		if (mergedArc instanceof ArcShape &&
		mergedArc.getStartPoint().equalsCloseEnough(lastElement.getStartPoint())) {
			elements[0] = mergedArc;
			elements.pop();
		}
	}
	if (!(elements[0] instanceof Vector3D) && !(lastElement instanceof Vector3D))
		return; // can't remove an element that is not a Vector3D.
	const toleranceThreshold = 0.000001 * roughPerimeter(elements);
	const startPoint = getStartPoint(elements[0]);
	const endPoint = getEndPoint(lastElement);
	if (Vector.coordsEqualEnough(startPoint.coords, endPoint.coords, toleranceThreshold)) {
		if (lastElement instanceof Vector3D)
			elements.pop(); // remove last element.
		else
			elements.shift();
	}
};