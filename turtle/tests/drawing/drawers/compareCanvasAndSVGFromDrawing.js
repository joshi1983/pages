import { compareCanvases } from '../../helpers/drawing/drawers/compareCanvases.js';
import { createTestG } from '../../helpers/createTestG.js';
import { drawingToCanvas } from '../../helpers/drawing/drawers/drawingToCanvas.js';
import { drawingToSVGText } from '../../../modules/drawing-menu/download/drawing-download/drawingToSVGText.js';
import { svgToCanvas } from '../../helpers/drawing/drawers/svgToCanvas.js';
import { SVGTransformer } from '../../../modules/components/svg-drawing-viewer/SVGTransformer.js';

export async function compareCanvasAndSVGFromDrawing(drawing, threshold, pixelGap, logger) {
	const width = 200, height = 200;
	const g = createTestG();
	const transformer = new SVGTransformer(g, width, height);
	const svgText = drawingToSVGText(drawing, transformer);
	const canvasSVG = await svgToCanvas(svgText, width, height);
	const canvas = drawingToCanvas(drawing, width, height);
	const result = compareCanvases(canvasSVG, canvas, pixelGap);
	if (result > threshold) {
		logger(`Expected SVG and canvas drawers to create the same or very similar image but difference ratio found to be ${result}.  The tolerance threshold was ${threshold}.  Run the code with prototypes/svgToCanvasPrototype.html to visually compare the results and start troubleshooting.`);
	}
};