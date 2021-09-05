import { testGetStringFromUrl } from './testGetStringFromUrl.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testIo(logger) {
	wrapAndCall([
		testGetStringFromUrl
	], logger);
};