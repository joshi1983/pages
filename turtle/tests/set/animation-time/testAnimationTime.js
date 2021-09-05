import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testTimeLocalStorage } from './testTimeLocalStorage.js';

export function testAnimationTime(logger) {
	testTimeLocalStorage(prefixWrapper('testTimeLocalStorage', logger));
};