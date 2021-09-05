import { clampRadianAngle } from '../../../../clampRadianAngle.js';
import { LineCap } from '../../shapes/style/LineCap.js';
import { mightStrokeOverlap } from './mightStrokeOverlap.js';
import { Vector } from
'../../Vector.js';

const errorThreshold = 0.000001;

function mightLineCapsNotHide(arc1, arc2) {
	const cap1 = arc1.style.getLineCap();
	const cap2 = arc2.style.getLineCap();
	if (cap2 === LineCap.Butt)
		return false; // no cap so the cap will definitely protrude out from behind arc1.

	if ((cap1 === LineCap.Square ||
	(cap1 === LineCap.Round && cap2 === LineCap.Round)) &&
	Math.abs(arc1.angle - arc2.angle) < errorThreshold) {
		// Check if the start and end points are the same for arc1 and arc2.
		const points1 = [arc1.getStartPoint(), arc1.getEndPoint()];
		const points2 = [arc2.getStartPoint(), arc2.getEndPoint()];
		if (!Vector.coordsEqualEnough(points1[0], points2[0], errorThreshold)) {
			points2.reverse();
		}
		if (Vector.coordsEqualEnough(points1[0], points2[0], errorThreshold) &&
		Vector.coordsEqualEnough(points1[1], points2[1], errorThreshold))
			return false;
	}
	if (cap2 === LineCap.Square) {
		return true;
	}
	if (cap2 === LineCap.Round) {
		if (cap1 === LineCap.Round || cap1 === LineCap.Square)
			return false;

		// FIXME: check if the angle range of arc1 is large enough to overlap arc2's line caps.
		// more overlap will be needed.
		//const capOffsetAngleRadians = Math.asin(arc2.style.getPenWidth() / 2 /
		//	(arc2.radius - arc2.style.getPenWidth() / 2));
		// FIXME: 
		return true;
	}
	return true;
}

/*
Checks if arc1 overlaps arc2.

If not sure, returns false.
*/
export function isArcHidingArc(arc1, arc2) {
	if (!mightStrokeOverlap(arc1, arc2))
		return false;

	if (Math.abs(arc1.angle) < Math.abs(arc2.angle))
		return false;

	if (arc1.radius !== arc2.radius)
		return false;

	let arc1AngleSum = arc1.rotationRadians + arc1.angle;
	const clampedSum = clampRadianAngle(arc1AngleSum);
	let fromZeroToVal = -1, fromAngleCycleEnd = Number.MAX_SAFE_INTEGER;
	if (arc1AngleSum !== clampedSum) {
		if (arc1.angle > 0)
			fromZeroToVal = clampedSum;
		else
			fromAngleCycleEnd = clampedSum;
	}

	for (let angle of [arc2.rotationRadians, arc2.rotationRadians + arc2.angle,
	arc2.rotationRadians + arc2.angle * 0.5]) {
		angle = clampRadianAngle(angle);
		if (arc1.angle > 0) {
			if (angle > fromZeroToVal && angle < arc1.rotationRadians)
				return false;
			if (angle > arc1AngleSum)
				return false;
		}
		else {
			if (angle > arc1.rotationRadians && angle < fromAngleCycleEnd)
				return false;
			if (angle < arc1AngleSum)
				return false;
		}
	}

	if (!Vector.coordsEqualEnough(arc1.position.coords, arc2.position.coords, errorThreshold))
		return false;

	if (mightLineCapsNotHide(arc1, arc2))
		return false;

	return true;
};