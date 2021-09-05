import { ArcShape } from '../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { getTransformInfo } from '../../../../../modules/drawing/drawers/svg/rounded-rect/getTransformInfo.js';
import { PathShape } from '../../../../../modules/drawing/vector/shapes/PathShape.js';
import { Vector3D } from '../../../../../modules/drawing/vector/Vector3D.js';

export function testGetTransformInfo(logger) {
	const radius = 10;
	const rightAngle = Math.PI / 2;
	const elements = [
		new Vector3D(100 - radius, 0, 0), new ArcShape(new Vector3D(100 - radius, radius, 0), 0, radius, rightAngle),
		new Vector3D(100, 100 - radius, 0), new ArcShape(new Vector3D(100 - radius, 100 - radius, 0), 0, radius, rightAngle),
		new Vector3D(radius, 100 - radius, 0), new ArcShape(new Vector3D(radius, 100 - radius, 0), 0, radius, rightAngle),
		new Vector3D(0, radius, 0), new ArcShape(new Vector3D(radius, radius, 0), 0, radius, rightAngle),
		];
	const path = new PathShape(elements, true);
	const result = getTransformInfo(path);
	
};