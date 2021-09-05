import { Rect } from '../../../../../modules/drawing/vector/shapes/procedural-raster-rectangle/Rect.js';

export function testRect(logger) {
	const rect = new Rect(0, 0, 20, 10, 1, 1);
	if (!(rect.imageData instanceof ImageData))
		logger(`imageData expected to be an instance of ImageData but it is not.  imageData=${rect.imageData}`);
	rect.setPixel(0, 0, 255, 255, 255, 255);
	rect.setPixel(19, 9, 255, 255, 255, 255);
	rect.setPixelChecked(0, 1, 255, 255, 255, 255);
	rect.setPixelChecked(19, 9, 255, 255, 255, 255);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	ctx.putImageData(rect.imageData, 0, 0);
};