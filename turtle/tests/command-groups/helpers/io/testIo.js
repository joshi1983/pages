import { testLogoDataInputStream } from './testLogoDataInputStream.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testIo(logger) {
	testLogoDataInputStream(prefixWrapper('testLogoDataInputStream', logger));
};