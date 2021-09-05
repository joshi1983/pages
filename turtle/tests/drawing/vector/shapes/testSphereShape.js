import { Camera } from '../../../../modules/drawing/vector/Camera.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { SphereShape } from '../../../../modules/drawing/vector/shapes/SphereShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testSphereShape(logger) {
	const s = new SphereShape(new Vector3D(), 10);
	if (s.radius !== 10)
		logger('Expected radius of 10 but got ' + s.radius);
	new SphereShape(new Vector3D(), 10, new ShapeStyle());
	const scaledS = s.transformBy(new Camera({'zoomScale': 10}));
	if (scaledS.radius !== 100)
		logger('Expected scaled radius of 100 but got ' + scaledS.radius);
};