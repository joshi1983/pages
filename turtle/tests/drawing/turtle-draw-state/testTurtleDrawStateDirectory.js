import { testGetTurtleStateMap } from './testGetTurtleStateMap.js';
import { testProcessPenUpStyle } from './testProcessPenUpStyle.js';
import { testSetTurtleState } from './testSetTurtleState.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testTurtleDrawStateDirectory(logger) {
	wrapAndCall([
		testGetTurtleStateMap,
		testProcessPenUpStyle,
		testSetTurtleState
	], logger);
};