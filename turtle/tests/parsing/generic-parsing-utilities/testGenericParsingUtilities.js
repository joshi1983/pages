import { testFlatten } from './testFlatten.js';
import { testGetClosestOfType } from './testGetClosestOfType.js';
import { testGetDescendentsOfTypes } from './testGetDescendentsOfTypes.js';
import { testGetTokensAtLine } from './testGetTokensAtLine.js';
import { testIsAfterOrSame } from './testIsAfterOrSame.js';
import { testParseTreeToken } from './testParseTreeToken.js';
import { testRotate } from './testRotate.js';
import { testSanitizeIdentifier } from './testSanitizeIdentifier.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testGenericParsingUtilities(logger) {
	wrapAndCall([
		testFlatten,
		testGetClosestOfType,
		testGetDescendentsOfTypes,
		testGetTokensAtLine,
		testIsAfterOrSame,
		testParseTreeToken,
		testRotate,
		testSanitizeIdentifier
	], logger);
};