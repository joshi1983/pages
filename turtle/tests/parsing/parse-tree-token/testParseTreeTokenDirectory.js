import { testGetCodeUpToToken } from './testGetCodeUpToToken.js';
import { testMightNeedSpaceBetweenTokens } from './testMightNeedSpaceBetweenTokens.js';
import { testModule } from './testModule.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testParseTreeTokenDirectory(logger) {
	return wrapAndCall([
		testGetCodeUpToToken,
		testMightNeedSpaceBetweenTokens,
		testModule
	], logger);
};