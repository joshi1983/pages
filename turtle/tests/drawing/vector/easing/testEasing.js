import { testEaseInOut } from './testEaseInOut.js';
import { testEaseLinear } from './testEaseLinear.js';
import { testEaseSteps } from './testEaseSteps.js';
import { testStepPosition } from './testStepPosition.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testEasing(logger) {
	wrapAndCall([
		testEaseInOut,
		testEaseLinear,
		testEaseSteps,
		testStepPosition
	], logger);
};