import { testAsyncDownscale } from './testAsyncDownscale.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCanvas(logger) {
	wrapAndCall([
		testAsyncDownscale
	], logger);
};