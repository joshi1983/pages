import { ArcShape } from '../../vector/shapes/ArcShape.js';
import { clamp } from '../../../clamp.js';
import { clampRadianAngle } from '../../../clampRadianAngle.js';
import { equalWithinThreshold } from '../../../equalWithinThreshold.js';
import { Vector } from '../../vector/Vector.js';
import { Vector2D } from '../../vector/Vector2D.js';
import { Vector3D } from '../../vector/Vector3D.js';

const halfPi = Math.PI / 2;
const radianAngleThreshold = 0.0001;

function getArcs(elements) {
	return elements.filter(e => e instanceof ArcShape);
}

function getDistance(from, to) {
	if (from.getEndPoint !== undefined)
		from = from.getEndPoint();
	if (to.getStartPoint !== undefined)
		to = to.getStartPoint();
	const diff = from.minus(to);
	return Vector.euclideanDistance(diff);
}

function getZ(element) {
	if (element.getZ !== undefined)
		return element.getZ();
	else
		return element.position.getZ();
}

function hasInconsistentZ(elements) {
	let z;
	for (let i = 0; i < elements.length; i++) {
		const e = elements[i];
		const eZ = getZ(e);
		if (z === undefined)
			z = eZ;
		else if (z !== eZ)
			return true;
	}
	return false;
}

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

export function isRoundedRect(path) {
	const elements = path.elements;
	if (elements.length < 8 || elements.length > 9)
		return false;
	/* If z is not consistent, it isn't safe to represent path with a rounded rect.
	The arcs could have orientations that would turn corners into ellipses. */
	if (hasInconsistentZ(elements))
		return false;
	if (getArcs(elements).length !== 4)
		return false;
	if (arcsOverlap(elements))
		return false;
	let length = 0;
	let arcRadius;
	for (let i = 1; i < elements.length; i++) {
		const prev = elements[i - 1];
		const e = elements[i];
		const len = getDistance(prev, e);
		length += len;
	}
	const errorThreshold = length * 0.00001;
	let previousRotationRadians, isIncreasingRadians;
	for (let i = 1; i < elements.length; i++) {
		const prev = elements[i - 1];
		const e = elements[i];
		// must alternate between Vector3D and ArcShape.
		if (prev.constructor.name === e.constructor.name && (
		i > 1 || e.constructor.name !== 'ArcShape'))
			return false;
		if (prev instanceof ArcShape) {
			if (!equalWithinThreshold(Math.abs(prev.angle), halfPi, radianAngleThreshold))
				return false;
			if (arcRadius === undefined)
				arcRadius = prev.radius;
			else if (!equalWithinThreshold(arcRadius, prev.radius, errorThreshold))
				return false; 
				// inconcsistent arc radius means this is not a rounded rectangle.
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
	const lastElement = elements[elements.length - 1];
	if (lastElement instanceof ArcShape) {
		if (!equalWithinThreshold(lastElement.radius, arcRadius, errorThreshold))
			return false;
	}

	return true;
};

function getCornerPositionDistances(elements) {
	const result = [];
	let prevPos;
	for (let i = 0; i < elements.length; i++) {
		const e = elements[i];
		if (e instanceof ArcShape) {
			if (prevPos !== undefined) {
				const distance = Vector.euclideanDistance(prevPos.minus(e.position));
				result.push(distance);
			}
			prevPos = e.position;
		}
	}
	return result;
}

export function drawRoundedRect(svgDrawer, path) {
	const rounder = svgDrawer.rounder;
	const arcs = getArcs(path.elements);
	const arc = arcs[arcs.length - 1];
	const cornerRadius = arc.radius;
	const lengths = getCornerPositionDistances(path.elements);
	const width = cornerRadius * 2 + lengths[0];
	const height = cornerRadius * 2 + lengths[1];
	let directionVector1 = arcs[1].position.minus(arcs[0].position);
	directionVector1 = Vector3D.normalize(directionVector1);
	let directionVector2 = arcs[2].position.minus(arcs[1].position);
	directionVector2 = Vector3D.normalize(directionVector2);
	const rotationRadians = Math.atan2(directionVector1.getY(), directionVector1.getX());
	let rotation = '';
	if (!equalWithinThreshold(rotationRadians, 0, radianAngleThreshold) && 
	!equalWithinThreshold(rotationRadians, 2 * Math.PI, radianAngleThreshold)) {
		rotation = ` transform="rotate(${rotationRadians * 180 / Math.PI})"`;
	}
	const p = Vector2D.rotate(arc.position.minus(directionVector1.minus(directionVector2).multiply(cornerRadius)).getXYVector(), -rotationRadians);
	const x = p.getX();
	const y = p.getY();
	const cornerRadiusRounded = rounder.formatNumber(cornerRadius);
	svgDrawer.pushTag(`<rect x="${rounder.formatNumber(x)}" y="${rounder.formatNumber(y)}" width="${rounder.formatNumber(width)}" height="${rounder.formatNumber(height)}"${svgDrawer.getStyleAttributes(path.style)}${rotation} rx="${cornerRadiusRounded}" ry="${cornerRadiusRounded}" />`);
};