import { testCommandsToMap } from './testCommandsToMap.js';
import { testGetDescendentsOfTypes } from './testGetDescendentsOfTypes.js';
import { testGetDistinctVariableName } from './testGetDistinctVariableName.js';
import { testGetTokensAtLine } from './testGetTokensAtLine.js';
import { testIsAfterOrSame } from './testIsAfterOrSame.js';
import { testParseTreeToken } from './testParseTreeToken.js';
import { testRotate } from './testRotate.js';
import { testSanitizeIdentifier } from './testSanitizeIdentifier.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testGenericParsingUtilities(logger) {
	wrapAndCall([
		testCommandsToMap,
		testGetDescendentsOfTypes,
		testGetDistinctVariableName,
		testGetTokensAtLine,
		testIsAfterOrSame,
		testParseTreeToken,
		testRotate,
		testSanitizeIdentifier
	], logger);
};