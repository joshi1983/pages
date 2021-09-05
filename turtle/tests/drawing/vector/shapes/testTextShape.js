import { BoundingBox } from '../../../../modules/drawing/vector/BoundingBox.js';
import { TextShape } from '../../../../modules/drawing/vector/shapes/TextShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testTextShape(logger) {
	const textShape = new TextShape(new Vector3D(), 0, 'Hello World');
	if (textShape.isVisible() !== true)
		logger('Expected to be visible but got ' + textShape.isVisible());
	const box = textShape.getBoundingBox();
	if (!(box instanceof BoundingBox))
		logger('Expected a bounding box but got ' + box);
};