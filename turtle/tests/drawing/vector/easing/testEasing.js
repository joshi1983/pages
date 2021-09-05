import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testEaseInOut } from './testEaseInOut.js';
import { testEaseLinear } from './testEaseLinear.js';
import { testEaseSteps } from './testEaseSteps.js';
import { testStepPosition } from './testStepPosition.js';

export function testEasing(logger) {
	testEaseInOut(prefixWrapper('testEaseInOut', logger));
	testEaseLinear(prefixWrapper('testEaseLinear', logger));
	testEaseSteps(prefixWrapper('testEaseSteps', logger));
	testStepPosition(prefixWrapper('testStepPosition', logger));
};