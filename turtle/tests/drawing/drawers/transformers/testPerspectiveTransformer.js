import { isNumber } from '../../../../modules/isNumber.js';
import { PerspectiveTransformer } from '../../../../modules/drawing/drawers/transformers/PerspectiveTransformer.js';
import { Vector2D } from '../../../../modules/drawing/vector/Vector2D.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testPerspectiveTransformer(logger) {
	const transformer = new PerspectiveTransformer(100, 100);
	const centre = transformer.getCentreOffset();
	if (centre.getX() !== 50)
		logger(`Expected centre x to be 50 but got ${centre.getX()}`);
	if (centre.getY() !== 50)
		logger(`Expected centre y to be 50 but got ${centre.getY()}`);
	/*
	Call the remaining methods to verify no JavaScript error is thrown.
	*/
	transformer.setScale(1);
	transformer.setDimensions(200, 200);
	transformer.translateBy(new Vector2D(5, -10));
	transformer.translateBy(new Vector3D(-5, 10, 4));
	transformer.multiplyScaleBy(2);
};