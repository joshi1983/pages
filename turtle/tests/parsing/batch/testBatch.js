import { testIsLikelyBatch } from './testIsLikelyBatch.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testBatch(logger) {
	wrapAndCall([
		testIsLikelyBatch
	], logger);
};