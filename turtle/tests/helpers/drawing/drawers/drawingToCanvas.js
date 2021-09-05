import { CanvasVector2DDrawer } from '../../../../modules/drawing/drawers/CanvasVector2DDrawer.js';
import { SVGTransformer } from '../../../../modules/components/svg-drawing-viewer/SVGTransformer.js';

export function drawingToCanvas(drawing, width, height) {
	if (typeof drawing !== 'object')
		throw new Error(`drawing must be an object but got ${drawing}`);
	if (!Number.isInteger(width))
		throw new Error(`width must be an integer but got ${width}`);
	if (!Number.isInteger(height))
		throw new Error(`height must be an integer but got ${height}`);

	const result = document.createElement('canvas');
	result.width = width;
	result.height = height;
	const div = document.createElement('div');
	div.innerHTML = '<svg><g></g></svg>';
	const g = div.querySelector('g');
	const transformer = new SVGTransformer(g, width, height);
	const drawer = new CanvasVector2DDrawer(undefined, width, height);
	drawing.width = width;
	drawing.height = height;
	drawing.drawAsSingleLayer(drawer, transformer.toCamera());
	drawer.copyToSingleCanvas(result);

	return result;
};