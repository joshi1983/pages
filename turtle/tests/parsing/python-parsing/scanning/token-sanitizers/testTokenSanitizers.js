import { testAddFunctionDefinitionArgListBrackets } from './testAddFunctionDefinitionArgListBrackets.js';
import { testMergeSpacedOperators } from './testMergeSpacedOperators.js';
import { testRemoveUnusedIndents } from './testRemoveUnusedIndents.js';
import { testRunAllSanitizers } from './testRunAllSanitizers.js';
import { testSanitizeColons } from './testSanitizeColons.js';
import { testSplitMinusOperator } from './testSplitMinusOperator.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTokenSanitizers(logger) {
	wrapAndCall([
		testAddFunctionDefinitionArgListBrackets,
		testMergeSpacedOperators,
		testRemoveUnusedIndents,
		testRunAllSanitizers,
		testSanitizeColons,
		testSplitMinusOperator
	], logger);
};