import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testAnimationTime } from './animation-time/testAnimationTime.js';

export function testSet(logger) {
	testAnimationTime(prefixWrapper('testAnimationTime', logger));
};