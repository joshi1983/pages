import { LineJoinStyle } from '../../modules/drawing/vector/shapes/style/LineJoinStyle.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TurtleDrawState } from '../../modules/drawing/TurtleDrawState.js';

export function testTurtleDrawStateGetLineJoinStyle(logger) {
	const turtleDrawState = new TurtleDrawState();
	const styleRawValue = turtleDrawState.getLineJoinStyle();
	if (styleRawValue !== LineJoinStyle.Miter)
		logger(`Expected the initial line join style to be Miter but got ${styleRawValue} which has the name ${LineJoinStyle.getNameFor(styleRawValue)}`);
};