import { testGetIncrementStep } from './testGetIncrementStep.js';
import { testGetRangeStopValueToken } from './testGetRangeStopValueToken.js';
import { testGetStopValue } from './testGetStopValue.js';
import { testIsNeedingNewVariable } from './testIsNeedingNewVariable.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testForLoops(logger) {
	wrapAndCall([
		testGetIncrementStep,
		testGetRangeStopValueToken,
		testGetStopValue,
		testIsNeedingNewVariable
	], logger);
};