import { ArcShape } from '../shapes/ArcShape.js';
import { PathShape } from '../shapes/PathShape.js';

export function mergeArcs(arc1, arc2) {
	if (arc1.preventPathJoin === true)
		return; // do not join.
	if (arc1.getEndPoint().equalsCloseEnough(arc2.getEndPoint())) {
		arc2.swapArcDirection();
	}
	if (arc2.getEndPoint().equalsCloseEnough(arc1.getStartPoint())) {
		const temp = arc1;
		arc1 = arc2;
		arc2 = temp;
	}
	if (arc1.getEndPoint().equalsCloseEnough(arc2.getStartPoint())) {
		const style = arc1.style.deepClone();
		style.clearFill();
		if (arc2.angle === 0) {
			return arc1;
		}
		else if (arc1.angle === 0) {
			return arc2;
		}
		if (arc1.radius === arc2.radius &&
		arc1.position.equalsCloseEnough(arc2.position) &&
		((arc1.angle > 0) === (arc2.angle > 0))) {
			const mergedArc = new ArcShape(arc1.position, arc1.rotationRadians,
			arc1.radius, arc1.angle + arc2.angle, arc1.style.deepClone());
			return mergedArc;
		}
		const elements = [
			arc1,
			arc2
		];
		return new PathShape(elements, false, style);
	}
	if (arc1.angle === 0) {
		// swap to make arc2 the most likely shape to have an angle of 0.
		const temp = arc1;
		arc1 = arc2;
		arc2 = temp;
	}
	if (arc2.angle === 0) {
		const style = arc1.style.deepClone();
		style.clearFill();
		// simplify arc2 to just a point.
		return new PathShape([arc1, arc2.getEndPoint()], false, style);
	}
};