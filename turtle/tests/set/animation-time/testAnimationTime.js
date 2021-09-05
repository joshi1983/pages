import { testIsUsingAnimationTime } from './testIsUsingAnimationTime.js';
import { testFastExecuter } from './testFastExecuter.js';
import { testTimeLocalStorage } from './testTimeLocalStorage.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testAnimationTime(logger) {
	wrapAndCall([
		testIsUsingAnimationTime,
		testFastExecuter,
		testTimeLocalStorage
	], logger);
};