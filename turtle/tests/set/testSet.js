import { testAnimationTime } from './animation-time/testAnimationTime.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testSet(logger) {
	return wrapAndCall([
		testAnimationTime
	], logger);
};