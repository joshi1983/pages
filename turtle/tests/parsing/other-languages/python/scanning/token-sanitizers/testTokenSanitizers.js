import { testAddFunctionDefinitionArgListBrackets } from './testAddFunctionDefinitionArgListBrackets.js';
import { testFixRepeat } from './testFixRepeat.js';
import { testMergeSpacedOperators } from './testMergeSpacedOperators.js';
import { testRemoveUnusedIndents } from './testRemoveUnusedIndents.js';
import { testRunAllSanitizers } from './testRunAllSanitizers.js';
import { testSanitizeColons } from './testSanitizeColons.js';
import { testSimplifyFunctionRenames } from './testSimplifyFunctionRenames.js';
import { testSplitMinusOperator } from './testSplitMinusOperator.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTokenSanitizers(logger) {
	wrapAndCall([
		testAddFunctionDefinitionArgListBrackets,
		testFixRepeat,
		testMergeSpacedOperators,
		testRemoveUnusedIndents,
		testRunAllSanitizers,
		testSanitizeColons,
		testSimplifyFunctionRenames,
		testSplitMinusOperator
	], logger);
};