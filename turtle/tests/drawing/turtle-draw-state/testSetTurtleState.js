import { Colour } from '../../../modules/Colour.js';
import { getTurtleStateMap } from '../../../modules/drawing/turtle-draw-state/getTurtleStateMap.js';
import { LineCap } from '../../../modules/drawing/vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../../../modules/drawing/vector/shapes/style/LineJoinStyle.js';
import { setTurtleState } from '../../../modules/drawing/turtle-draw-state/setTurtleState.js';
import { TurtleDrawState } from '../../../modules/drawing/TurtleDrawState.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';
await Colour.asyncInit();

function simpleTest(logger) {
	const turtleDrawState = new TurtleDrawState();
	const result = getTurtleStateMap(turtleDrawState);
	setTurtleState(turtleDrawState, result);
}

function advancedTest(logger) {
	const turtleDrawState = new TurtleDrawState();
	turtleDrawState.setLineJoinStyle("round");
	turtleDrawState.setLineCap(LineCap.Square);
	turtleDrawState.setPenWidth(4);
	turtleDrawState.setPenColor(new Colour("red"));
	turtleDrawState.setFillColor(new Colour("blue"));
	const result = getTurtleStateMap(turtleDrawState);

	turtleDrawState.setLineJoinStyle("miter");
	turtleDrawState.setLineCap(LineCap.Butt);
	turtleDrawState.setPenWidth(8);
	turtleDrawState.setPenColor(new Colour("black"));
	turtleDrawState.setFillColor(new Colour("white"));
	turtleDrawState.penUp();

	setTurtleState(turtleDrawState, result);
	if (turtleDrawState.getPenWidth() !== 4)
		logger(`Expected pen width of 4 but got ${turtleDrawState.getPenWidth()}`);
	if (!turtleDrawState.getPenColor().equals(new Colour('red')))
		logger(`Expected pen color of red but got ${turtleDrawState.getPenColor()}`);
	if (!turtleDrawState.getFillColor().equals(new Colour('blue')))
		logger(`Expected fill color of blue but got ${turtleDrawState.getFillColor()}`);
	if (turtleDrawState.getLineJoinStyle() !== LineJoinStyle.Round)
		logger(`Expected line join style of ${LineJoinStyle.Round} but got ${turtleDrawState.getLineJoinStyle()}`);
	if (turtleDrawState.getLineCap() !== LineCap.Square)
		logger(`Expected line cap of ${LineCap.Square} but got ${turtleDrawState.getLineCap()}`);
	if (turtleDrawState.isPenDown !== true)
		logger(`Expected isPenDown to be true but got ${turtleDrawState.isPenDown}`);
}

export function testSetTurtleState(logger) {
	wrapAndCall([
		advancedTest,
		simpleTest
	], logger);
};