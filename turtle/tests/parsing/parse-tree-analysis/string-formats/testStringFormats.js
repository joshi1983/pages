import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testAbsoluteUrl } from './testAbsoluteUrl.js';

export function testStringFormats(logger) {
	testAbsoluteUrl(prefixWrapper('testAbsoluteUrl', logger));
};