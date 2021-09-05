import { Vector } from '../../drawing/vector/Vector.js';
import { vectorProject } from './vectorProject.js';

/*
Implemented based on math at
https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
*/

export function linePointDistance(linePoint1, linePoint2, point) {
	const maxLen = Math.max(linePoint1.length, linePoint2.length, point.length);
	const minLen = Math.min(linePoint1.length, linePoint2.length, point.length);
	if (maxLen !== minLen) {
		throw new Error(`The lengths of points must be equal but got linePoint1 length of ${linePoint1.length}, linePoint2 length of ${linePoint2.length}, point length of ${point.length}`);
	}
	if (maxLen === 2) {
		const dx = linePoint2[0] - linePoint1[0];
		const dy = linePoint2[1] - linePoint1[1];
		const bottom = Math.hypot(dx, dy);
		if (bottom === 0)
			return 0; // unknown direction to line so just assume 0 distance between line and point.
		return Math.abs(dx * (linePoint1[1] - point[1]) - dy * (linePoint1[0] - point[0])) / bottom;
	}
	else {
		/*
		The following would work for any dimensions but the above case should perform a little faster for 2 dimensions.
		*/
		const delta1 = Vector.minusCoords(linePoint1, point);
		const directionVector = Vector.minusCoords(linePoint1, linePoint2);
		const proj = vectorProject(directionVector, delta1);
		const projMagnitudeSquared = Vector.sumOfSquares(proj);
		const distance1Squared = Vector.sumOfSquares(delta1);
		return Math.sqrt(distance1Squared - projMagnitudeSquared);
	}
};