import { ArrayUtils } from '../../../ArrayUtils.js';
import { BoundingBox } from '../../../drawing/vector/BoundingBox.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

export function updatePointCentre(previewer) {
	const lines = previewer.lines;
	let box;
	if (lines.length === 0) {
		box = new BoundingBox();
		box.min = new Vector3D(-5, -5, -5);
		box.max = new Vector3D(5, 5, 5);
	}
	else {
		const points = lines.map(line => line.point1);
		ArrayUtils.pushAll(points, lines.map(line => line.point2));
		box = new BoundingBox(points);
	}
	previewer.pointCentre = box.getCentre();
	const radius1 = box.max.getY() - box.min.getY();
	const radius2 = Math.max(box.max.getX() - box.min.getX(), box.max.getZ() - box.min.getZ());
	previewer.rotationRadius = radius1 + radius2;
};