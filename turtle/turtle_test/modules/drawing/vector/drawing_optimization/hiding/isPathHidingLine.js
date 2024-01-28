import { getEnd } from './getEnd.js';
import { getStart } from './getStart.js';
import { mightStrokeOverlap } from './mightStrokeOverlap.js';
import { Vector } from '../../Vector.js';

function lineSegmentHidingLineSegment(p1, p2, p3, p4, errorThreshold) {
	if (Vector.coordsEqualEnough(p1.coords, p3.coords, errorThreshold) &&
	Vector.coordsEqualEnough(p2.coords, p4.coords, errorThreshold))
		return true;
	if (Vector.coordsEqualEnough(p2.coords, p3.coords, errorThreshold) &&
	Vector.coordsEqualEnough(p1.coords, p4.coords, errorThreshold))
		return true;

	// FIXME: look for being parallel and completely within the span of prev to next.
	return false;
}

function isPathStrokeHidingLine(path, line) {
	let len = Math.max(0.1, line.position.minus(line.endPoint).magnitude());
	const errorThreshold = len * 0.000001;
	const elements = path.elements;
	for (let i = 1; i < elements.length; i++) {
		const prev = getEnd(elements[i - 1]);
		const next = getStart(elements[i]);
		if (lineSegmentHidingLineSegment(prev, next, line.position, line.endPoint, errorThreshold))
			return true;
	}
	if (elements.length > 2 && path.isClosed) {
		/* if the path is closed, the first and last elements are connected. */
		const prev = getStart(elements[0]);
		const next = getEnd(elements[elements.length - 1]);
		if (lineSegmentHidingLineSegment(prev, next, line.position, line.endPoint, errorThreshold))
			return true;
	}
	return false;
}

/*
Returns true only if we're completely sure that path hides line.

Returns false if path definitely hide line.

Returns false also if path just might hide line.
We want to minimize these cases but isPathHidingLine always err's on the side of false if uncertain.
*/
export function isPathHidingLine(path, line) {
	if (!mightStrokeOverlap(path, line))
		return false;

	// For now, all we do is check if the stroke is hiding the line.
	return isPathStrokeHidingLine(path, line);
};