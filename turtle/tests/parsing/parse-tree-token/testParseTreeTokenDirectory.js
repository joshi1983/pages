import { testGetCodeUpToToken } from './testGetCodeUpToToken.js';
import { testMightNeedSpaceBetweenTokens } from './testMightNeedSpaceBetweenTokens.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testParseTreeTokenDirectory(logger) {
	wrapAndCall([
		testGetCodeUpToToken,
		testMightNeedSpaceBetweenTokens
	], logger);
};