import { testFixDynamicScopes } from './testFixDynamicScopes.js';
import { testGetPolyUnsafeProcedures } from './testGetPolyUnsafeProcedures.js';
import { testMinusFixer } from './testMinusFixer.js';
import { testSanitization } from './sanitization/testSanitization.js';
import { testSanitizeColourString } from './testSanitizeColourString.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testFixDynamicScopes,
		testGetPolyUnsafeProcedures,
		testMinusFixer,
		testSanitization,
		testSanitizeColourString,
	], logger);
};