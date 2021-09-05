import { compareCanvases } from '../../helpers/drawing/drawers/compareCanvases.js';
import { createDrawingFromCode } from '../../helpers/createDrawingFromCode.js';
import { createTestG } from '../../helpers/createTestG.js';
import { drawingToCanvas } from '../../helpers/drawing/drawers/drawingToCanvas.js';
import { drawingToSVGText } from '../../../modules/drawing-menu/download/drawing-download/drawingToSVGText.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { svgToCanvas } from '../../helpers/drawing/drawers/svgToCanvas.js';
import { SVGTransformer } from '../../../modules/components/svg-drawing-viewer/SVGTransformer.js';

const roundedRectProc = `to roundedRectangle :width :height :cornerRadius
	localmake "oldState turtleState
	localmake "width1 :width - :cornerRadius * 2
	localmake "height1 :height - :cornerRadius * 2
	jumpRight :cornerRadius
	right 90
	polyStart
	repeat 2 [
		forward :width1
		ArcLeft 90 :cornerRadius
		forward :height1
		ArcLeft 90 :cornerRadius
	]
	polyEnd
	setTurtleState :oldState
end
`;
const getGradientProc = `to getGradient
	localmake "oldPos pos
	localmake "colorStops createPList
	setProperty "colorStops 0 "red
	setProperty "colorStops 1 "blue
	localmake "fromPos pos
	jumpForward 100
	localmake "result createLinearGradient :fromPos pos :colorStops "pad
	jumpTo :oldPos
	output :result
end
`;

export function testCanvasAndSVGLooksSame(logger) {
	const cases = [
		'fd 50',
		'setPenSize 15\nfd 50',
		'setPenSize 15\nrepeat 3 [\nfd 50\nright 90\n]\nclosePath',
		'setPenSize 15\nrepeat 4 [\nfd 50\nright 90\n]\nclosePath',
		'setFillColor "red\nsetPenSize 10\npolyStart\nrepeat 4 [\nfd 50\nright 90\n]\npolyEnd',
		'right 10\nsetFillColor "red\nsetPenSize 15\npolyStart\nrepeat 4 [\nfd 50\nright 90\n]\npolyEnd',
		'right 10\nsetFillColor "red\nsetPenSize 0\npolyStart\nrepeat 4 [\nfd 50\nright 90\n]\npolyEnd',
		'right 10\nsetPenSize 15\nfd 50',
		'setLineCap "round\nsetPenSize 15\nfd 50',
		'setLineCap "butt\nsetPenSize 15\nfd 50',
		'setLineCap "square\nsetPenSize 15\nfd 50',
		'setLineCap "round\nsetPenSize 15\nfd 20\narcRight 90 10',
		'setLineCap "butt\nsetPenSize 15\nfd 20\narcRight 90 10',
		'setLineCap "square\nsetPenSize 15\nfd 20\narcRight 90 10',
		{'code': `setPenSize 25
repeat 4 [
	arcRight 90 20
		forward 20
		]`,
		'threshold': 0.00065
		},
		{'code': `setPenSize 25
repeat 4 [
	arcLeft 90 20
		forward 20
		]`,
		'threshold': 0.00065
		},
		`setPenSize 25
repeat 3 [
	arcRight 90 20
		forward 20
		]\nclosePath`,
		`setPenSize 25
repeat 3 [
		forward 20
	arcRight 90 20
		]\nclosePath`,
		`setFillColor "red
make "r 10
circle 20
setPenSize 0
polyStart
jumpforward 50
arcleft 90 :r
jumpForward 100
arcLeft 90 :r
jumpForward 50
arcleft 90 :r
jumpForward 100
arcleft 90 :r
setPenSize 1
polyEnd`,
		{
			'code': roundedRectProc + '\nsetPenSize 5\nroundedRectangle 50 100 15',
			'threshold': 0.0003
		},
		roundedRectProc + getGradientProc + '\nsetFillGradient getGradient\nsetPenSize 5\nroundedRectangle 50 100 15',
		roundedRectProc + getGradientProc + '\nsetFillGradient getGradient\nright 30\nsetPenSize 5\nroundedRectangle 50 100 15',
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