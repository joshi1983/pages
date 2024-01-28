import { ArcShape } from '../../shapes/ArcShape.js';
import { mightStrokeOverlap } from './mightStrokeOverlap.js';
import { Vector } from '../../Vector.js';

function isPathStrokeHidingArc(path, arc) {
	let len = Math.max(0.1, arc.radius * arc.angle);
	const errorThreshold = len * 0.000001;
	const elements = path.elements;
	const end = arc.getEndPoint();
	const start = arc.getStartPoint();
	for (let i = 1; i < elements.length; i++) {
		const e = elements[i];
		if (!(e instanceof ArcShape))
			continue;
		if (Math.abs(e.angle) < Math.abs(arc.angle) || e.radius < arc.radius)
			continue;
		if (Vector.coordsEqualEnough(e.position.coords, arc.position.coords, errorThreshold)) {
			if (e.rotationRadians === arc.rotationRadians)
				return true;
			let p1 = e.getStartPoint();
			let p2 = e.getEndPoint();
			if (Vector.coordsEqualEnough(p1, start, errorThreshold) &&
			Vector.coordsEqualEnough(p2, end, errorThreshold))
				return true;
			if (Vector.coordsEqualEnough(p2, start, errorThreshold) &&
			Vector.coordEqualEnough(p1, end, errorThreshold))
				return true;
		}
	}
	return false;
}

export function isPathHidingArc(path, arc) {
	if (!mightStrokeOverlap(path, arc))
		return false;

	return isPathStrokeHidingArc(path, arc);
};