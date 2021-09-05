import { LineSegmentShape } from '../shapes/LineSegmentShape.js';
import { Vector3D } from '../Vector3D.js';

function isBetween(val1, val2, val3) {
	const min = Math.min(val1, val2);
	const max = Math.max(val1, val2);
	return min <= val3 && max >= val3;
}

function mightOverlap_(line1, line2, coordIndex) {
	return isBetween(line1.position.coords[coordIndex], line1.endPoint.coords[coordIndex], line2.position.coords[coordIndex]) ||
	isBetween(line1.position.coords[coordIndex], line1.endPoint.coords[coordIndex], line2.endPoint.coords[coordIndex]);
}

function mightOverlap(line1, line2, coordIndex) {
	return mightOverlap_(line1, line2, coordIndex) ||
		mightOverlap_(line2, line1, coordIndex);
}

function getCoordIndexWithMaxAbsoluteValue(v) {
	let result = 0;
	let abs = Math.abs(v.coords[0]);
	for (let i = 1; i < 3; i++) {
		const newAbs = Math.abs(v.coords[i]);
		if (newAbs > abs) {
			abs = newAbs;
			result = i;
		}
	}
	return result;
}

function getMinPoint(points, coordIndex) {
	const min = Math.min(...points.map(point => point.coords[coordIndex]));
	return points.filter(point => point.coords[coordIndex] === min)[0];
}

function getMaxPoint(points, coordIndex) {
	const max = Math.max(...points.map(point => point.coords[coordIndex]));
	return points.filter(point => point.coords[coordIndex] === max)[0];
}

function isConnected(position, direction, otherPoint, coordIndex) {
	const denominator = direction.coords[coordIndex];
	// avoid division by 0 and working with NaN or infinities.
	if (denominator === 0)
		return false;
	const coefficient = (otherPoint.coords[coordIndex] - position.coords[coordIndex]) / denominator;
	const v2 = position.plus(direction.multiply(coefficient));
	return v2.minus(otherPoint).magnitude() < 0.00001;
}

/*
Returns undefined if unable to merge the line segments.
*/
export function mergeOverlappingParallelLines(line1, line2) {
	let dir1 = line1.endPoint.minus(line1.position);
	const coordIndex = getCoordIndexWithMaxAbsoluteValue(dir1);
	// Look for a way that the lines don't intersect.
	if (!mightOverlap(line1, line2, coordIndex))
		return undefined;
	let dir2 = line2.endPoint.minus(line2.position);
	dir1 = Vector3D.normalize(dir1);
	dir2 = Vector3D.normalize(dir2);
	if ((dir1.coords[coordIndex] < 0) !== (dir2.coords[coordIndex] < 0))
		dir2 = dir2.multiply(-1); // flip direction.
	// if the direction is very, very similar, merge.
	if (dir1.minus(dir2).magnitude() < 0.0001) {
		if (!isConnected(line1.position, dir1, line2.position, coordIndex))
			return undefined;

		const p1 = getMinPoint([line1.position, line1.endPoint, line2.position, line2.endPoint], coordIndex);
		const p2 = getMaxPoint([line1.position, line1.endPoint, line2.position, line2.endPoint], coordIndex);
		return new LineSegmentShape(new Vector3D(p1), new Vector3D(p2), line1.style.deepClone());
	}
	return undefined;
};