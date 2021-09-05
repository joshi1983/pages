import { testGetCodeUpToToken } from './testGetCodeUpToToken.js';
import { testGetDescendentsOfTypes } from './testGetDescendentsOfTypes.js';
import { testIsAfterOrSame } from './testIsAfterOrSame.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testParseTreeTokenDirectory(logger) {
	wrapAndCall([
		testGetCodeUpToToken,
		testGetDescendentsOfTypes,
		testIsAfterOrSame
	], logger);
};