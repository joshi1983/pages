import { getThumbnailDimensions } from
'../../../../modules/drawing-menu/download/animation-download/getThumbnailDimensions.js';

export function testGetThumbnailDimensions(logger) {
	const inCanvas = document.createElement('canvas');
	inCanvas.setAttribute('width', 640);
	inCanvas.setAttribute('height', 480);
	const outCanvas = document.createElement('canvas');
	const result = getThumbnailDimensions(outCanvas, inCanvas);
	if (typeof result !== 'object')
		logger(`Expected result to be an object but got ${result}`);
	else if (!Number.isInteger(result.width) || !Number.isInteger(result.height))
		logger(`Expected width and height to be integers but got width: ${result.width} and height: ${result.height}`);
};