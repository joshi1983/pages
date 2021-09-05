import { testFixDynamicScopes } from './testFixDynamicScopes.js';
import { testSanitizeColourString } from './testSanitizeColourString.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testFixDynamicScopes,
		testSanitizeColourString
	], logger);
};