import { testGetCodeUpToToken } from './testGetCodeUpToToken.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testParseTreeTokenDirectory(logger) {
	wrapAndCall([
		testGetCodeUpToToken
	], logger);
};