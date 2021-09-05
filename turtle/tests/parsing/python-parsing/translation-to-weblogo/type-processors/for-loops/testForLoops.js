import { testIsNeedingNewVariable } from './testIsNeedingNewVariable.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testForLoops(logger) {
	wrapAndCall([
		testIsNeedingNewVariable
	], logger);
};