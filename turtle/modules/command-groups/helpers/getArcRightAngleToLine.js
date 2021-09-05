import { getArcLeftAngleToLine, sanitizeLength } from './getArcLeftAngleToLine.js';
import { Vector } from '../../drawing/vector/Vector.js';
import { Vector2D } from '../../drawing/vector/Vector2D.js';

function flipLeftRight(coords) {
	return [-coords[0], coords[1]];
}

export function getArcRightAngleToLine(startHeadingRadians, startPosition,
arcRadius, linePoint1, linePoint2) {
	// Let's convert the data into a form that would get the correct result 
	// using getArcLeftAngleToLine.
	startPosition = sanitizeLength(startPosition);
	linePoint1 = sanitizeLength(linePoint1);
	linePoint2 = sanitizeLength(linePoint2);

	linePoint1 = Vector.minusCoords(linePoint1, startPosition);
	linePoint2 = Vector.minusCoords(linePoint2, startPosition);
	linePoint1 = Vector2D.rotateCoords(linePoint1, startHeadingRadians);
	linePoint2 = Vector2D.rotateCoords(linePoint2, startHeadingRadians);

	linePoint1 = flipLeftRight(linePoint1);
	linePoint2 = flipLeftRight(linePoint2);
	return getArcLeftAngleToLine(0, [0,0], arcRadius, linePoint1, linePoint2);
};