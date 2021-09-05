import { getTurtleStateMap } from '../../../modules/drawing/turtle-draw-state/getTurtleStateMap.js';
import { TurtleDrawState } from '../../../modules/drawing/TurtleDrawState.js';

export function testGetTurtleStateMap(logger) {
	const turtleDrawState = new TurtleDrawState();
	const result = getTurtleStateMap(turtleDrawState);
	if (!(result instanceof Map))
		logger(`Expected a Map but got ${result}`);
	else {
		const expectedStringKeys = ['fontFamily', 'lineCap', 'lineJoinStyle'];
		expectedStringKeys.forEach(function(stringKey) {
			if (typeof result.get(stringKey) !== 'string')
				logger(`Expected a string for ${stringKey} but got ${result.get(stringKey)}`);
		});
	}
};