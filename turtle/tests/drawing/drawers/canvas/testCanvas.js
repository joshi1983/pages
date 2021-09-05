import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testAsyncDownscale } from './testAsyncDownscale.js';

export function testCanvas(logger) {
	testAsyncDownscale(prefixWrapper('testAsyncDownscale', logger));
};