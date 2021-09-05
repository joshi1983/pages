import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testIsUsingAnimationTime } from './testIsUsingAnimationTime.js';
import { testFastExecuter } from './testFastExecuter.js';
import { testTimeLocalStorage } from './testTimeLocalStorage.js';

export function testAnimationTime(logger) {
	testIsUsingAnimationTime(prefixWrapper('testIsUsingAnimationTime', logger));
	testFastExecuter(prefixWrapper('testFastExecuter', logger));
	testTimeLocalStorage(prefixWrapper('testTimeLocalStorage', logger));
};