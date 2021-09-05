import { PathShape } from '../shapes/PathShape.js';

export function mergePathWithArc(pline1, arc) {
	if (pline1.getEndPoint().equalsCloseEnough(arc.getEndPoint()) || pline1.getStartPoint().equalsCloseEnough(arc.getStartPoint())) {
		arc.swapArcDirection();
	}
	if (pline1.getEndPoint().equalsCloseEnough(arc.getStartPoint())) {
		const newPoints = pline1.elements.slice(0);
		newPoints.push(arc);
		return new PathShape(newPoints, false, pline1.style);
	}
	else if (pline1.getStartPoint().equalsCloseEnough(arc.getEndPoint())) {
		const newPoints = pline1.elements.slice(0);
		newPoints.unshift(arc);
		return new PathShape(newPoints, false, pline1.style);
	}
};