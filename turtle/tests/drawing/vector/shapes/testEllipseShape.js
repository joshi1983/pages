import { Camera } from '../../../../modules/drawing/vector/Camera.js';
import { EllipseShape } from '../../../../modules/drawing/vector/shapes/EllipseShape.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testEllipseShape(logger) {
	const e = new EllipseShape(new Vector3D(), 0, 10, 20);
	if (e.rotationRadians !== 0)
		logger('Expected rotationRadians of 0 but got ' + e.rotationRadians);
	if (e.radius1 !== 10)
		logger('Expected radius1 of 10 but got ' + e.radius1);
	if (e.radius2 !== 20)
		logger('Expected radius2 of 20 but got ' + e.radius2);
	new EllipseShape(new Vector3D(), 0, 10, 30);
	new EllipseShape(new Vector3D(), 45, 20, 10, new ShapeStyle());
	const scaledEllipse = e.transformBy(new Camera({'zoomScale': 5}));
	if (scaledEllipse.radius1 !== 50)
		logger('Expected scaled radius1 to be 50 but got ' + scaledEllipse.radius1);
	if (scaledEllipse.radius2 !== 100)
		logger('Expected scaled radius2 to be 100 but got ' + scaledEllipse.radius2);

	const box = e.getBoundingBox();
	if (box.max.getY() > 20.5)
		logger('Box max y expected to be no more than 20.5 but got ' + box.max.getY());
	if (box.max.getY() < 10.5)
		logger('Box max y expected to be no less than 10.5 but got ' + box.max.getY());
};