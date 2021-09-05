import { PathShape } from '../shapes/PathShape.js';
import { Vector3D } from '../Vector3D.js';

export function mergeLineWithArc(line, arc) {
	if (arc.getEndPoint().equalsCloseEnough(line.endPoint))
		line.swapEndPoints();
	if (arc.getEndPoint().equalsCloseEnough(line.position)) {
		const elements = [
			arc,
			new Vector3D(line.endPoint.coords.slice(0))
		];
		return new PathShape(elements, false, line.style.deepClone());
	}

	// increase likelihood of us being able to merge the line 
	// and arc by swapping end points of the line or the arc.
	if (line.position.equalsCloseEnough(arc.getStartPoint()))
		line.swapEndPoints();

	if (line.endPoint.equalsCloseEnough(arc.getStartPoint())) {
		const elements = [
			new Vector3D(line.position.coords.slice(0)),
			arc
		];
		return new PathShape(elements, false, line.style.deepClone());
	}
};