import { testRemoveUnusedIndents } from './testRemoveUnusedIndents.js';
import { testRunAllSanitizers } from './testRunAllSanitizers.js';
import { testSanitizeColons } from './testSanitizeColons.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTokenSanitizers(logger) {
	wrapAndCall([
		testRemoveUnusedIndents,
		testRunAllSanitizers,
		testSanitizeColons
	], logger);
};