import { LineCap } from '../vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../vector/shapes/style/LineJoinStyle.js';
import { MathCommands } from '../../command-groups/MathCommands.js';
import { Transparent } from '../../Transparent.js';

function colorToSerializable(c) {
	if (c === Transparent)
		return c;
	else
		return c.toString();
}

export function getTurtleStateMap(turtleDrawState) {
	const result = new Map([
		['fillColor', colorToSerializable(turtleDrawState.style.getFillColor())],
		['fillGradient', turtleDrawState.style.getFillGradient()],
		['fontFamily', turtleDrawState.style.getFontFamily()],
		['fontSize', turtleDrawState.style.getFontSize()],
		['isPenDown', turtleDrawState.isPenDown],
		['lineCap', LineCap.getNameFor(turtleDrawState.getLineCap())],
		['lineJoinStyle', LineJoinStyle.getNameFor(turtleDrawState.getLineJoinStyle())],
		['orientation', turtleDrawState.orientation.getDataTransferObject()],
		['penColor', colorToSerializable(turtleDrawState.style.getPenColor())],
		['penGradient', turtleDrawState.style.getPenGradient()],
		['penSize', turtleDrawState.style.getPenWidth()],
		['position', turtleDrawState.position.coords.slice(0)],
	]);

	return result;
};