import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testPathShape(logger) {
	const points = [
		new Vector3D(1, 2, 3),
		new Vector3D(5, 6, 7),
		new Vector3D(-9, -11, -13)
	];
	const p = new PathShape(points, false);
	const box = p.getBoundingBox();
	if (box.min.getX() > -9)
		logger('box min x expected to be at most -9 but got ' + box.min.getX());
	if (box.min.getY() > -11)
		logger('box min y expected to be at most -11 but got ' + box.min.getY());
	if (box.min.getZ() > -13)
		logger('box min z expected to be at most -13 but got ' + box.min.getZ());

	if (box.max.getX() < 5)
		logger('box max x expected to be at most 5 but got ' + box.max.getX());
	if (box.max.getY() < 6)
		logger('box max y expected to be at most 6 but got ' + box.max.getY());
	if (box.max.getZ() < 7)
		logger('box max z expected to be at most 7 but got ' + box.max.getZ());
	p.clone();
};