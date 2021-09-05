import { Camera } from '../../../../modules/drawing/vector/Camera.js';
import { EllipseArcShape } from '../../../../modules/drawing/vector/shapes/EllipseArcShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testEllipseArcShape(logger) {
	const shape = new EllipseArcShape(new Vector3D(), 0, 100, 200, Math.PI * 0.25, 0);
	if (shape.isVisible() !== true)
		logger('Expected isVisible() to return true but got ' + shape.isVisible());
	const camera = new Camera();
	shape.transformBy(camera);
};