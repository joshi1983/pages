import { createTestDrawing } from '../../helpers/createTestDrawing.js';
import { isNumber } from '../../../modules/isNumber.js';
import { sleep } from '../../helpers/sleep.js';
import { SVGDrawingViewer } from '../../../modules/components/svg-drawing-viewer/SVGDrawingViewer.js';

export async function testSVGDrawingViewer(logger) {
	const drawing = createTestDrawing();
	const e = document.createElement('div');
	e.style.height = '100px';
	e.style.width = '200px';
	document.body.appendChild(e);
	await sleep(100);
	// give a little time to load the dimensions properly before running the rest of the test.
	const viewer = new SVGDrawingViewer(e, drawing);
	await sleep(100);
	viewer.zoomIn();
	viewer.zoomOut();
	viewer.nudgeIn();
	viewer.nudgeOut();
	viewer.setAspectRatio(1);
	const numberMethods = ['getAspectWidth', 'getAspectHeight'];
	numberMethods.forEach(function(numberMethod) {
		if (typeof viewer[numberMethod] !== 'function')
			logger(`Expected to find a method named ${numberMethod} but it is not a function.`);
		else if (!isNumber(viewer[numberMethod]()))
			logger(`Expected ${numberMethod} expected to return a number but got ${viewer[numberMethod]()}`);
	});
	const aspectWidth = viewer.getAspectWidth();
	if (typeof aspectWidth !== 'number')
		logger('Expected a number for aspectWidth but got ' + aspectWidth);
	e.remove();
};