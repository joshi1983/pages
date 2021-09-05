import { allStraightSegmentsConnectedToArcs } from './allStraightSegmentsConnectedToArcs.js';
import { ArcShape } from '../../../vector/shapes/ArcShape.js';
import { clamp } from '../../../../clamp.js';
import { equalWithinThreshold } from '../../../../equalWithinThreshold.js';
import { getArcs } from './getArcs.js';
import { getDistance } from '../getDistance.js';
import { hasGradientProblem } from './hasGradientProblem.js';
import { hasInconsistentZ } from './hasInconsistentZ.js';
import { Vector } from '../../../vector/Vector.js';
import { Vector3D } from '../../../vector/Vector3D.js';

const halfPi = Math.PI / 2;
const radianAngleThreshold = 0.0001;

function isAngleCloseToZero(arc, dir) {
	const dirs = [arc.getStartPoint(), arc.getEndPoint()];
	for (let i = 0; i < dirs.length; i++) {
		const dir1 = dirs[i];
		const arcDir1 = arc.position.minus(dir1);
		/*
		Using clamp to avoid floating point error getting cosRatio1 out 
		of -1..1 and thereby causing angle1 to be calculated as NaN.
		*/
		const cosRatio1 = clamp(Vector.dotProduct(dir.coords, arcDir1.coords) / (dir.magnitude() * arc.radius), -1, 1);
		const angle1 = Math.acos(cosRatio1);
		if (equalWithinThreshold(angle1, 0, radianAngleThreshold) ||
		equalWithinThreshold(angle1, 2 * Math.PI, radianAngleThreshold)) {
			return true;
		}
	}
	return false;
}

function arcsOverlap(elements) {
	const arcs = getArcs(elements);
	const firstArc = arcs[0];
	const dir1 = arcs[1].position.minus(firstArc.position);
	if (!isAngleCloseToZero(firstArc, dir1))
		return true;
	const secondArc = arcs[1];
	const dir2 = arcs[2].position.minus(secondArc.position);
	if (!isAngleCloseToZero(secondArc, dir2))
		return true;

	return false;
}

function isOptimizedRoundRect(path) {
	const elements = path.elements;
	if (elements.length < 4 || elements.length > 5)
		return false;
	if (elements.length === 5) {
		const last = elements[4];
		if (last instanceof Vector3D) {
			const first = elements[0];
			const startPoint = first.getStartPoint();
			const distance = startPoint.minus(last).magnitude();
			if (distance < 0.0000001)
				return true;
		}
	}
	else
		return true;
	return false;
}

export function isRoundedRect(path) {
	const elements = path.elements;
	if (elements.length < 4 || elements.length > 9)
		return false;
	/* If z is not consistent, it isn't safe to represent path with a rounded rect.
	The arcs could have orientations that would turn corners into ellipses. */
	if (hasInconsistentZ(elements))
		return false;
	const arcs = getArcs(elements);
	if (arcs.length !== 4)
		return false;
	if (arcsOverlap(elements))
		return false;
	if (hasGradientProblem(path))
		return false;
	let length = 0;
	let arcRadius = arcs[0].radius;
	for (let i = 1; i < elements.length; i++) {
		const prev = elements[i - 1];
		const e = elements[i];
		const len = getDistance(prev, e);
		length += len;
	}
	const errorThreshold = length * 0.00001;
	for (let i = 1; i < arcs.length; i++) {
		const arc = arcs[i];
		// inconsistent arc radius means this is not a rounded rectangle.
		if (!equalWithinThreshold(arc.radius, arcRadius, errorThreshold))
			return false; // all corners must have the same arc radius in a rounded rectangle.
		if (!equalWithinThreshold(Math.abs(arc.angle), halfPi, radianAngleThreshold))
			return false;
	}
	if (!allStraightSegmentsConnectedToArcs(elements, errorThreshold))
		return false;
	if (isOptimizedRoundRect(path))
		return true;
	if (elements.length < 8 || elements.length > 9)
		return false;
	let previousRotationRadians, isIncreasingRadians;
	for (let i = 1; i < elements.length; i++) {
		const prev = elements[i - 1];
		const e = elements[i];
		// must alternate between Vector3D and ArcShape.
		if (prev.constructor.name === e.constructor.name)
			return false;
		if (prev instanceof ArcShape) {
			if (previousRotationRadians !== undefined) {
				const delta = prev.rotationRadians - previousRotationRadians;
				const absDelta = Math.abs(delta);
				if (!equalWithinThreshold(absDelta, halfPi, radianAngleThreshold) && !equalWithinThreshold(absDelta, halfPi * 3, radianAngleThreshold))
					return false;
				if (equalWithinThreshold(Math.abs(delta), halfPi, radianAngleThreshold)) {
					if (isIncreasingRadians !== undefined) {
						if (isIncreasingRadians !== (delta > 0))
							return false;
					}
					else {
						isIncreasingRadians = (delta > 0);
					}
				}
			}
			previousRotationRadians = prev.rotationRadians;
		}
	}
	return true;
};