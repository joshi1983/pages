import { testFlatten } from './testFlatten.js';
import { testGetClosestOfType } from './testGetClosestOfType.js';
import { testGetDescendentsOfTypes } from './testGetDescendentsOfTypes.js';
import { testIsAfterOrSame } from './testIsAfterOrSame.js';
import { testParseTreeToken } from './testParseTreeToken.js';
import { testRotate } from './testRotate.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testGenericParsingUtilities(logger) {
	wrapAndCall([
		testFlatten,
		testGetClosestOfType,
		testGetDescendentsOfTypes,
		testIsAfterOrSame,
		testParseTreeToken,
		testRotate
	], logger);
};