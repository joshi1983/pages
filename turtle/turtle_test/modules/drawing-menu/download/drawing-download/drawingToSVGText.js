import { optimizeDrawing } from '../../../drawing/drawers/svg/drawing-optimization/optimizeDrawing.js';
import { SVGVector2DDrawer } from '../../../drawing/drawers/SVGVector2DDrawer.js';
import { SVGTransformer } from '../../../components/svg-drawing-viewer/SVGTransformer.js';

export function drawingToSVGText(drawing, transformer) {
	drawing = optimizeDrawing(drawing);
	const drawer = new SVGVector2DDrawer(transformer.width, transformer.height);
	drawing.drawAsSingleLayer(drawer);
	drawer.setDimensions(transformer.width, transformer.height);
	const gTag = transformer.getGTag();
	return drawer.toString({'GTag': gTag});
};