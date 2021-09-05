import { Vector } from
'../../drawing/vector/Vector.js';
import { Vector2D } from
'../../drawing/vector/Vector2D.js';
import { vectorProject } from
'./vectorProject.js';

export function getCircleCenter(startHeadingRadians, startPosition, arcRadius) {
	if (!(startPosition instanceof Array))
		throw new Error(`startPosition must be an Array but got ${startPosition}`);
	const offsetX = -arcRadius * Math.cos(startHeadingRadians);
	const offsetY = arcRadius * Math.sin(startHeadingRadians);
	return [offsetX + startPosition[0], offsetY + startPosition[1]];
};

function getNearestPointInLine(point, linePoint1, directionVector) {
	const translatedPoint = Vector.minusCoords(point, linePoint1);
	const translatedProj = vectorProject(directionVector, translatedPoint);
	const result = [];
	for (let i = 0; i < 2; i++) {
		result[i] = translatedProj[i] + linePoint1[i];
	}
	return result;
}

export function sanitizeLength(coords) {
	if (coords.length <= 2)
		return coords;
	return coords.slice(0, 2);
};

function getArcLeftAngleToPoint(circleCenter, startHeadingRadians, endPoint) {
	endPoint = Vector.minusCoords(endPoint, circleCenter);
	endPoint = Vector2D.rotateCoords(endPoint, startHeadingRadians);
	let result = Math.atan2(endPoint[1], endPoint[0]);
	if (result < 0)
		result = Math.PI * 2 + result;
	return result;
}

export function getArcLeftAngleToLine(startHeadingRadians, startPosition,
arcRadius, linePoint1, linePoint2) {
	// The caller might pass arrays of length 3 or more.
	// We want to fix that length to 2 so we don't throw errors when
	// the caller mixes different lengths that are all at least 2.
	linePoint1 = sanitizeLength(linePoint1);
	linePoint2 = sanitizeLength(linePoint2);
	startPosition = sanitizeLength(startPosition);

	const circleCenter = getCircleCenter(startHeadingRadians, startPosition, arcRadius);

	// Note that directionVector may not have a magnitude of 1.
	// Normally direction vectors are unit vectors in linear algebra but
	// normalizing it isn't needed here to get the correct result.
	let directionVector = Vector.minusCoords(linePoint1, linePoint2);

	// get nearest point from circleCenter to the line.
	const nearestPoint = getNearestPointInLine(circleCenter, linePoint1, directionVector);
	const centerToNearestDistance = Vector.euclideanDistance(Vector.minusCoords(nearestPoint, circleCenter));
	if (centerToNearestDistance > arcRadius)
		return -1; // no intersection found

	const angleDeltaRadians = 2 * Math.abs(Math.acos(centerToNearestDistance / arcRadius));
	const halfChord = Math.sqrt(arcRadius * arcRadius - centerToNearestDistance * centerToNearestDistance);
	const m = Vector.euclideanDistance(directionVector);
	directionVector = Vector.multiplyCoords(directionVector, halfChord / m);
	const endPoint1 = Vector.plusCoords(directionVector, nearestPoint);
	
	const endPoint2 = Vector.minusCoords(nearestPoint, directionVector);
	const angleRadians1 = getArcLeftAngleToPoint(circleCenter, startHeadingRadians, endPoint1);
	const angleRadians2 = getArcLeftAngleToPoint(circleCenter, startHeadingRadians, endPoint2);
	let angleRadians = Math.min(angleRadians1, angleRadians2);

	return angleRadians * 180 / Math.PI;
};