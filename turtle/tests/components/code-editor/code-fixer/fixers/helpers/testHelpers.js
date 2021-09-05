import { testFixDynamicScopes } from './testFixDynamicScopes.js';
import { testGetPolyUnsafeProcedures } from './testGetPolyUnsafeProcedures.js';
import { testMinusFixer } from './testMinusFixer.js';
import { testRemoveUnneededCurvedBrackets } from './testRemoveUnneededCurvedBrackets.js';
import { testRemoveUnusedParameters } from './testRemoveUnusedParameters.js';
import { testSanitization } from './sanitization/testSanitization.js';
import { testSanitizeColourString } from './testSanitizeColourString.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testFixDynamicScopes,
		testGetPolyUnsafeProcedures,
		testMinusFixer,
		testRemoveUnneededCurvedBrackets,
		testRemoveUnusedParameters,
		testSanitization,
		testSanitizeColourString,
	], logger);
};