import { asyncDownscale } from '../../../drawing/drawers/canvas/asyncDownscale.js';
import { clamp } from '../../../clamp.js';
import { CanvasVector2DDrawer } from '../../../drawing/drawers/CanvasVector2DDrawer.js';
import { downloadDataUrl } from '../../../components/downloadDataUrl.js';
import { drawingToSVGText } from './drawingToSVGText.js';
import { getFilename } from '../getFilename.js';
import { getPostScriptDataURL } from './getPostScriptDataURL.js';

export async function previewerDownload(drawing, transformer, mime) {
	if (typeof mime !== 'string')
		throw new Error('mime must be a string');
	const dataUrl = await getDataURL(drawing, transformer, mime);
	downloadDataUrl(getFilename(mime), dataUrl);
};

function getSVGDataURL(drawing, transformer) {
	const text = drawingToSVGText(drawing, transformer);
	return 'data:image/svg+xml;base64,'+btoa(text);
}

function getDownscaleFactor(transformer) {
	const pixelCount = transformer.width * transformer.height;
	return Math.floor(clamp(Math.sqrt(5000000 / pixelCount), 1, 8));
}

async function getRasterDataURL(drawing, transformer, mime) {
	function createCanvas() {
		const result = document.createElement('canvas');
		result.setAttribute('width', transformer.width);
		result.setAttribute('height', transformer.height);
		return result;
	}
	let singleLayerCanvas = createCanvas();
	const originalWidth = drawing.width;
	const originalHeight = drawing.height;
	const downscaleFactor = getDownscaleFactor(transformer);

	if (downscaleFactor === 1) {
		drawing.width = transformer.width;
		drawing.height = transformer.height;
		const drawer = new CanvasVector2DDrawer(undefined, transformer.width, transformer.height);
		drawing.drawAsSingleLayer(drawer, transformer.toCamera());
		drawer.copyToSingleCanvas(singleLayerCanvas);
	}
	else {
		const downscaleWidth = transformer.width * downscaleFactor;
		const downscaleHeight = transformer.height * downscaleFactor;
		transformer.setDimensions(downscaleWidth, downscaleHeight);
		transformer.setScale(transformer.scale * downscaleFactor);
		const drawer = new CanvasVector2DDrawer(undefined, transformer.width, transformer.height);
		drawing.width = transformer.width;
		drawing.height = transformer.height;
		const largeCanvas = createCanvas();
		drawing.drawAsSingleLayer(drawer, transformer.toCamera());
		drawer.copyToSingleCanvas(largeCanvas);
		const imageData = await asyncDownscale(downscaleFactor, largeCanvas);
		const ctx = singleLayerCanvas.getContext('2d');
		ctx.putImageData(imageData, 0, 0);
	}

	// restore original dimensions of drawing.
	// If the dimensions aren't restored, downloading an image with 
	// different resolution erroneously moves the centre offset in the graphics screen.
	drawing.width = originalWidth;
	drawing.height = originalHeight;
	transformer.setDimensions(originalWidth, originalHeight);

	return singleLayerCanvas.toDataURL(mime);
}

async function getDataURL(drawing, transformer, mime) {
	if (mime.indexOf('svg') !== -1)
		return getSVGDataURL(drawing, transformer);
	else if (mime.indexOf('postscript') !== -1)
		return getPostScriptDataURL(drawing, transformer);
	else
		return await getRasterDataURL(drawing, transformer, mime);
}