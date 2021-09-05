import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testGetStringFromUrl } from './testGetStringFromUrl.js';

export function testIo(logger) {
	testGetStringFromUrl(prefixWrapper('testGetStringFromUrl', logger));
};