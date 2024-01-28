import { PathShape } from '../shapes/PathShape.js';

export function mergeArcs(arc1, arc2) {
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
			return new PathShape([arc1], false, style);
		}
		else if (arc1.angle === 0) {
			return new PathShape([arc2], false, style);
		}
		const points = [
			arc1,
			arc2
		];
		return new PathShape(points, false, style);
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