import { testGetRecommendedRemovals } from './testGetRecommendedRemovals.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testPenUp(logger) {
	wrapAndCall([
		testGetRecommendedRemovals
	], logger);
};