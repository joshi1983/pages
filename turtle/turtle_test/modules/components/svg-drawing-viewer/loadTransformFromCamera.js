import { Camera } from '../../drawing/vector/Camera.js';
import { SVGTransformer } from './SVGTransformer.js';
import { Vector2D } from '../../drawing/vector/Vector2D.js';

export function loadTransformFromCamera(camera, transformer, scaleFactor) {
	if (!(camera instanceof Camera))
		throw new Error('camera must be a Camera');
	if (!(transformer instanceof SVGTransformer))
		throw new Error('transformer must be an SVGTransformer');
	if (typeof scaleFactor !== 'number')
		throw new Error('scaleFactor must be a number');

	transformer.setScale(1);
	transformer.translateBy(new Vector2D(camera.position.getX(), -camera.position.getY()));
	transformer.setScale(camera.getZoomScale() * scaleFactor);
};