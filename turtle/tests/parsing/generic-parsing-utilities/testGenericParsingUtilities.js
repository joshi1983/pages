import { testFlatten } from './testFlatten.js';
import { testGetClosestOfType } from './testGetClosestOfType.js';
import { testParseTreeToken } from './testParseTreeToken.js';
import { testRotate } from './testRotate.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testGenericParsingUtilities(logger) {
	wrapAndCall([
		testFlatten,
		testGetClosestOfType,
		testParseTreeToken,
		testRotate
	], logger);
};