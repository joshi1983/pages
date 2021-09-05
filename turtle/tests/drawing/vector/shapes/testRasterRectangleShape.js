import { getImageDataUrl } from '../../../helpers/getImageDataUrl.js';
import { RasterRectangleShape } from '../../../../modules/drawing/vector/shapes/RasterRectangleShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testRasterRectangleShape(logger) {
	const raster = new RasterRectangleShape(new Vector3D(), 64, 32, 0, getImageDataUrl());
	const box = raster.getBoundingBox();
	if (Math.abs(box.min.getY()) > 0.00001)
		logger('Expected min Y to be 0 but got ' + box.min.getY());
	if (box.max.getY() !== 32)
		logger('Expected max Y to be 32 but got ' + box.max.getY());
	if (box.min.getX() !== -32)
		logger('Expected min X to be -32 but got ' + box.min.getX());
	if (box.max.getX() !== 32)
		logger('Expected max X to be 32 but got ' + box.max.getX());
}