import { PathShape } from '../shapes/PathShape.js';
import { Vector3D } from '../Vector3D.js';

export function mergePathWithArc(pline1, arc) {
	if (pline1.preventPathJoin === true)
		return; // do not join.
	if (pline1.getEndPoint().equalsCloseEnough(arc.getEndPoint()) || pline1.getStartPoint().equalsCloseEnough(arc.getStartPoint())) {
		arc.swapArcDirection();
	}
	if (pline1.getEndPoint().equalsCloseEnough(arc.getStartPoint())) {
		if (arc.angle === 0)
			return pline1;
		const newPoints = pline1.elements.slice(0);
		const endElement = pline1.elements[pline1.elements.length - 1];
		if (endElement instanceof Vector3D)
			newPoints.pop();
		newPoints.push(arc);
		return new PathShape(newPoints, false, pline1.style);
	}
	else if (pline1.getStartPoint().equalsCloseEnough(arc.getEndPoint())) {
		if (arc.angle === 0)
			return pline1;
		const newPoints = pline1.elements.slice(0);
		newPoints.unshift(arc);
		return new PathShape(newPoints, false, pline1.style);
	}
};