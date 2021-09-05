import { Colour } from '../../../modules/Colour.js';
import { createTestPostScriptDrawing } from '../../helpers/createTestPostScriptDrawing.js';
import { drawingToPostScriptText } from '../../../modules/drawing-menu/download/drawing-download/getPostScriptDataURL.js';
import { PageSize } from '../../../modules/drawing/drawers/post-script/PageSize.js';
import { PostScriptDrawer } from '../../../modules/drawing/drawers/PostScriptDrawer.js';
import { SVGTransformer } from '../../../modules/components/svg-drawing-viewer/SVGTransformer.js';
import { Turtle } from '../../../modules/command-groups/Turtle.js';
import { VectorDrawing } from '../../../modules/drawing/vector/VectorDrawing.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function createPenColorTestDrawing1() {
	const settings = {'animationTime': 0};
	const result = new VectorDrawing();
	const turtle = new Turtle(settings, result);
	turtle.setColors(new Colour("red"));
	turtle.circle(10);
	return result;
}

function drawingToPostScript(drawing) {
	const div = document.createElement('div');
	div.innerHTML = '<svg><g></g></svg>';
	const g = div.querySelector('svg > g');
	const transformer = new SVGTransformer(g, 100, 100);
	return drawingToPostScriptText(drawing, transformer);
}

function testGeneral(logger) {
	const drawing = createTestPostScriptDrawing();
	const pageSize = PageSize.getPageSizeClosestToDimensions(100, 100);
	const drawer = new PostScriptDrawer(1, pageSize.getCentre(), pageSize);
	drawing.drawAsSingleLayer(drawer);
	const s = drawer.toString();
	if (typeof s !== 'string')
		logger('toString() must return a string but got: ' + s);
}

function testPenColor1(logger) {
	const drawing = createPenColorTestDrawing1();
	const shapes = drawing.getShapesArray();
	const red = new Colour("red");
	if (shapes.length !== 1)
		logger(`Expected there to be 1 shape but found ${shapes.length}`);
	else if (!shapes[0].style.getPenColor().equals(red))
		logger(`Expected pen color to match red but got ${shapes[0].style.getPenColor()}`);
	else {
		const postscript = drawingToPostScript(drawing);
		const redStrokeSubstring = '1 0 0 setrgbcolor\nstroke';
		if (postscript.indexOf(redStrokeSubstring) === -1)
			logger(`Expected postscript to contain ${redStrokeSubstring} but not found in ${postscript}`);
	}
}

export function testPostScriptDrawer(logger) {
	wrapAndCall([
		testGeneral,
		testPenColor1
	], logger);
};