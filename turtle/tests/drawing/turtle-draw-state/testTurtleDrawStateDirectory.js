import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testGetTurtleStateMap } from './testGetTurtleStateMap.js';
import { testSetTurtleState } from './testSetTurtleState.js';

export function testTurtleDrawStateDirectory(logger) {
	testGetTurtleStateMap(prefixWrapper('testGetTurtleStateMap', logger));
	testSetTurtleState(prefixWrapper('testSetTurtleState', logger));
};