import { ArcShape } from '../shapes/ArcShape.js';
import { Vector3D } from '../Vector3D.js';

export function optimizeArcsInPath(path) {
	const elements = path.elements;
	for (let i = 2; i < elements.length; i++) {
		const arc1 = elements[i - 2];
		if (!(arc1 instanceof ArcShape))
			continue;
		const prev = elements[i - 1];
		if (!(prev instanceof Vector3D) ||
		!prev.equalsCloseEnough(arc1.getEndPoint()))
			continue;
		const arc2 = elements[i];
		if (!(arc2 instanceof ArcShape) ||
		arc1.radius !== arc2.radius ||
		!arc1.position.equalsCloseEnough(arc2.position) ||
		!arc1.getEndPoint().equalsCloseEnough(arc2.getStartPoint()))
			continue;
		const mergedArc = new ArcShape(arc1.position, arc1.rotationRadians,
			arc1.radius, arc1.angle + arc2.angle, arc1.style.deepClone());
		i -= 2;
		elements.splice(i, 3, mergedArc);
	}
};