import { Camera } from '../../../../modules/drawing/vector/Camera.js';
import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function testGeneral(logger) {
	const c = new CircleShape(new Vector3D(), 9.5);
	c.clone();
	if (c.radius !== 9.5)
		logger('Expected radius of 9.5 but got ' + c.radius);
	const box = c.getBoundingBox();
	if (box.min.getX() !== -10)
		logger('box min x expected to be -10 but got ' + box.min.getX());
	if (box.min.getY() !== -10)
		logger('box min y expected to be -10 but got ' + box.min.getY());
	if (box.min.getY() !== -10)
		logger('box min z expected to be -10 but got ' + box.min.getZ());
	if (box.max.getX() !== 10)
		logger('box max x expected to be 10 but got ' + box.max.getX());
	if (box.max.getY() !== 10)
		logger('box max y expected to be 10 but got ' + box.max.getY());
	if (box.max.getY() !== 10)
		logger('box max z expected to be 10 but got ' + box.max.getZ());
	new CircleShape(new Vector3D(), 10);
	new CircleShape(new Vector3D(), 10, new ShapeStyle());
	c.radius = 10;
	const scaledCircle = c.transformBy(new Camera({'zoomScale': 5}));
	if (scaledCircle.radius !== 50)
		logger('Expected scaled radius to be 50 but got ' + scaledCircle.radius);
}

function testTinyRadius(logger) {
	const style = new ShapeStyle();
	style.setPenWidth(40);
	const c = new CircleShape(new Vector3D(), 16, style);
	if (c.radius !== 20)
		logger(`Expected radius to be 20 but got ${c.radius}`);
	if (c.style.getPenWidth() !== 32)
		logger(`Expected pen width to be 32 but got ${c.style.getPenWidth()}`);
}

export function testCircleShape(logger) {
	testGeneral(prefixWrapper('testGeneral', logger));
	testTinyRadius(prefixWrapper('testTinyRadius', logger));
};