import { testConvertDoubleSlashSingleLineComments } from
'./testConvertDoubleSlashSingleLineComments.js';
import { testGenericInsertArgBrackets } from
'./testGenericInsertArgBrackets.js';
import { testGenericProcessTo } from
'./testGenericProcessTo.js';
import { testGenericProcessToFromMultipleSourceTokens } from
'./testGenericProcessToFromMultipleSourceTokens.js';
import { testGetArgCountFromScanTokens } from './testGetArgCountFromScanTokens.js';
import { testInsertSpacesAfterIntegerLabels } from
'./testInsertSpacesAfterIntegerLabels.js';
import { testProcessKeywords } from './testProcessKeywords.js';
import { testProcessThenGoto } from './testProcessThenGoto.js';
import { testScanTokensToCode } from './testScanTokensToCode.js';
import { testStripBASICCommentsAndEmptyStringLiterals } from
'./testStripBASICCommentsAndEmptyStringLiterals.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testConvertDoubleSlashSingleLineComments,
		testGenericInsertArgBrackets,
		testGenericProcessTo,
		testGenericProcessToFromMultipleSourceTokens,
		testGetArgCountFromScanTokens,
		testInsertSpacesAfterIntegerLabels,
		testProcessKeywords,
		testProcessThenGoto,
		testScanTokensToCode,
		testStripBASICCommentsAndEmptyStringLiterals
	], logger);
};