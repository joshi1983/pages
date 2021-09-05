import { compareCanvases } from '../../helpers/drawing/drawers/compareCanvases.js';
import { createDrawingFromCode } from '../../helpers/createDrawingFromCode.js';
import { createTestG } from '../../helpers/createTestG.js';
import { drawingToCanvas } from '../../helpers/drawing/drawers/drawingToCanvas.js';
import { drawingToSVGText } from '../../../modules/drawing-menu/download/drawing-download/drawingToSVGText.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { svgToCanvas } from '../../helpers/drawing/drawers/svgToCanvas.js';
import { SVGTransformer } from '../../../modules/components/svg-drawing-viewer/SVGTransformer.js';

export function testCanvasAndSVGLooksSame(logger) {
	const cases = [
		'fd 50',
		'setPenSize 10\nfd 50',
		'setPenSize 10\nrepeat 3 [\nfd 50\nright 90\n]\nclosePath',
		'setPenSize 10\nrepeat 4 [\nfd 50\nright 90\n]\nclosePath',
		'setFillColor "red\nsetPenSize 10\npolyStart\nrepeat 4 [\nfd 50\nright 90\n]\npolyEnd',
		'right 10\nsetFillColor "red\nsetPenSize 10\npolyStart\nrepeat 4 [\nfd 50\nright 90\n]\npolyEnd',
		'right 10\nsetFillColor "red\nsetPenSize 0\npolyStart\nrepeat 4 [\nfd 50\nright 90\n]\npolyEnd',
		'right 10\nsetPenSize 10\nfd 50',
		'setLineCap "round\nsetPenSize 10\nfd 50',
		'setLineCap "butt\nsetPenSize 10\nfd 50',
		'setLineCap "square\nsetPenSize 10\nfd 50',
		'setLineCap "round\nsetPenSize 10\nfd 20\narcRight 90 10',
		'setLineCap "butt\nsetPenSize 10\nfd 20\narcRight 90 10',
		'setLineCap "square\nsetPenSize 10\nfd 20\narcRight 90 10',
		{'code': `setPenSize 5
repeat 4 [
	arcRight 90 20
		forward 20
		]`,
		'pixelGap': 2,
		'threshold': 0.00065
		}
	];
	const width = 200, height = 200;
	const pixelGap = 2;
	const defaultThreshold = 0.0002;
	cases.forEach(async function(caseInfo, index) {
		if (typeof caseInfo === 'string') {
			caseInfo = {
				'code': caseInfo
			};
		}
		if (caseInfo.pixelGap === undefined)
			caseInfo.pixelGap = pixelGap;
		if (caseInfo.threshold === undefined)
			caseInfo.threshold = defaultThreshold;
		const code = caseInfo.code;
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const drawing = createDrawingFromCode(code, plogger);
		const g = createTestG();
		const transformer = new SVGTransformer(g, width, height);
		const svgText = drawingToSVGText(drawing, transformer);
		const canvasSVG = await svgToCanvas(svgText, width, height);
		const canvas = drawingToCanvas(drawing, width, height);
		const result = compareCanvases(canvasSVG, canvas, caseInfo.pixelGap);
		if (result > caseInfo.threshold) {
			plogger(`Expected SVG and canvas drawers to create the same or very similar image but difference ratio found to be ${result}.  The tolerance threshold was ${caseInfo.threshold}.  Run the code with prototypes/svgToCanvasPrototype.html to visually compare the results and start troubleshooting.`);
		}
	});
};