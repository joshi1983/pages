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
		const points = [
			arc1,
			arc2
		];
		const style = arc1.style.deepClone();
		style.clearFill();
		return new PathShape(points, false, style);
	}
};