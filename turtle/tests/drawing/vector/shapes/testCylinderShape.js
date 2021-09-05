import { Camera } from '../../../../modules/drawing/vector/Camera.js';
import { CylinderShape } from '../../../../modules/drawing/vector/shapes/CylinderShape.js';
import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testConstructor(logger) {
	const c = new CylinderShape(new Vector3D(), new Vector3D(), 10);
	if (c.radius !== 10)
		logger('CylinderShape expected to have radius 10 but got ' + c.radius);
	new CylinderShape(new Vector3D(), new Vector3D(), 15, new ShapeStyle());

	c.getBoundingBox();
	c.clone();
}

function testCreateFromLineSegmentShape(logger) {
	const line = new LineSegmentShape(new Vector3D(1, 2, 3), new Vector3D(4, 5, 6), new ShapeStyle({
		'pen': {
			'width': 20
		}
	}));
	const c = CylinderShape.createFromLineSegmentShape(line);
	if (c.position.getX() !== 1)
		logger('Expected position x to be 1 but got ' + c.position.getX());
	if (c.position.getY() !== 2)
		logger('Expected position y to be 2 but got ' + c.position.getY());
	if (c.position.getZ() !== 3)
		logger('Expected position z to be 3 but got ' + c.position.getZ());

	if (c.endPoint.getX() !== 4)
		logger('Expected endPoint x to be 4 but got ' + c.endPoint.getX());
	if (c.endPoint.getY() !== 5)
		logger('Expected endPoint y to be 5 but got ' + c.endPoint.getY());
	if (c.endPoint.getZ() !== 6)
		logger('Expected endPoint z to be 6 but got ' + c.endPoint.getZ());
	
	if (c.radius !== 10)
		logger('Radius expected to be 10 (half of the line segment pen width of 20) but got ' + c.radius);
	const scaledC = c.transformBy(new Camera({'zoomScale': 10}));
	if (scaledC.radius !== 100)
		logger('Radius expected to be 100 (10*10) but got ' + scaledC.radius);
}

export function testCylinderShape(logger) {
	wrapAndCall([
		testConstructor,
		testCreateFromLineSegmentShape
	], logger);
};