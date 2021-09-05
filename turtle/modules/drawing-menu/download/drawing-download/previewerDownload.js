import { CanvasVector2DDrawer } from '../../../drawing/drawers/CanvasVector2DDrawer.js';
import { downloadDataUrl } from '../../../components/downloadDataUrl.js';
import { drawingToSVGText } from './drawingToSVGText.js';
import { getFilename } from '../showFileFormatSelector.js';
import { getPostScriptDataURL } from './getPostScriptDataURL.js';

export function previewerDownload(drawing, transformer, mime) {
	if (typeof mime !== 'string')
		throw new Error('mime must be a string');
	downloadDataUrl(getFilename(mime), getDataURL(drawing, transformer, mime));
};

function getSVGDataURL(drawing, transformer) {
	const text = drawingToSVGText(drawing, transformer);
	return 'data:image/svg+xml;base64,'+btoa(text);
}

function getRasterDataURL(drawing, transformer, mime) {
	function createCanvas() {
		const result = document.createElement('canvas');
		result.setAttribute('width', transformer.width);
		result.setAttribute('height', transformer.height);
		return result;
	}
	const singleLayerCanvas = createCanvas();
	const canvases = [];
	for (let i = 0; i < 3; i++) {
		canvases.push(createCanvas());
	}
	const originalWidth = drawing.width;
	const originalHeight = drawing.height;
	const drawer = new CanvasVector2DDrawer(canvases, transformer.width, transformer.height);
	drawing.width = transformer.width;
	drawing.height = transformer.height;
	drawing.drawAsSingleLayer(drawer, transformer.toCamera());
	drawer.copyToSingleCanvas(singleLayerCanvas);

	// restore original dimensions of drawing.
	// If the dimensions aren't restored, downloading an image with 
	// different resolution erroneously moves the centre offset in the graphics screen.
	drawing.width = originalWidth;
	drawing.height = originalHeight;

	return singleLayerCanvas.toDataURL(mime);
}

function getDataURL(drawing, transformer, mime) {
	if (mime.indexOf('svg') !== -1)
		return getSVGDataURL(drawing, transformer);
	else if (mime.indexOf('postscript') !== -1)
		return getPostScriptDataURL(drawing, transformer);
	else
		return getRasterDataURL(drawing, transformer, mime);
}