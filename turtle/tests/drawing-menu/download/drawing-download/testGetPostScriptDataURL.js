import { getPostScriptDataURL } from '../../../../modules/drawing-menu/download/drawing-download/getPostScriptDataURL.js';
import { SVGTransformer } from '../../../../modules/components/svg-drawing-viewer/SVGTransformer.js';
import { Vector2DDrawing } from '../../../../modules/drawing/vector/Vector2DDrawing.js';

export function testGetPostScriptDataURL(logger) {
	const drawing = new Vector2DDrawing();
	const e = document.createElement('div');
	e.innerHTML = '<svg><g></g></svg>';
	const g = e.querySelector('g');
	const transformer = new SVGTransformer(g, 100, 100);
	const url = getPostScriptDataURL(drawing, transformer);
	if (typeof url !== 'string')
		logger('data url expected to be a string but got ' + url);
};