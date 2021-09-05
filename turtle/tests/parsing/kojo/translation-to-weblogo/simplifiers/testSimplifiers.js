import { testArgListBracketBalanceFixer } from './testArgListBracketBalanceFixer.js';
import { testForToRepeatFor } from './testForToRepeatFor.js';
import { testFunctionsToMethods } from './testFunctionsToMethods.js';
import { testInsertBeginEndShape } from './testInsertBeginEndShape.js';
import { testQuoteStringsFixer } from './testQuoteStringsFixer.js';
import { testRenameClashingDefNames } from './testRenameClashingDefNames.js';
import { testReplaceRangeToWithToOperator } from './testReplaceRangeToWithToOperator.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testSimplifiers(logger) {
	wrapAndCall([
		testArgListBracketBalanceFixer,
		testForToRepeatFor,
		testFunctionsToMethods,
		testInsertBeginEndShape,
		testQuoteStringsFixer,
		testRenameClashingDefNames,
		testReplaceRangeToWithToOperator
	], logger);
};