import { Camera } from '../../../modules/drawing/vector/Camera.js';
import { Vector2D } from '../../../modules/drawing/vector/Vector2D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testTransform2D(logger) {
	const cam = new Camera();
	const v2d = new Vector2D();
	const result = cam.transform2D(v2d);
	if (!(result instanceof Vector2D))
		logger('result expected to be a Vector2D but it is not.  result = ' + result);
}

export function testCamera(logger) {
	wrapAndCall([
		testTransform2D
	], logger);
};