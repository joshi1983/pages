import { testForToRepeatFor } from './testForToRepeatFor.js';
import { testInsertBeginEndShape } from './testInsertBeginEndShape.js';
import { testQuoteStringsFixer } from './testQuoteStringsFixer.js';
import { testRenameClashingDefNames } from './testRenameClashingDefNames.js';
import { testReplaceRangeToWithToOperator } from './testReplaceRangeToWithToOperator.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testSimplifiers(logger) {
	wrapAndCall([
		testForToRepeatFor,
		testInsertBeginEndShape,
		testQuoteStringsFixer,
		testRenameClashingDefNames,
		testReplaceRangeToWithToOperator
	], logger);
};