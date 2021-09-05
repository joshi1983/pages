import { testGetTurtleStateMap } from './testGetTurtleStateMap.js';
import { testSetTurtleState } from './testSetTurtleState.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testTurtleDrawStateDirectory(logger) {
	wrapAndCall([
		testGetTurtleStateMap,
		testSetTurtleState
	], logger);
};