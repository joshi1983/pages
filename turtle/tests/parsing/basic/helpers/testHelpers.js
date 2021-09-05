import { testGenericProcessToFromMultipleSourceTokens } from
'./testGenericProcessToFromMultipleSourceTokens.js';
import { testInsertSpacesAfterIntegerLabels } from './testInsertSpacesAfterIntegerLabels.js';
import { testProcessThenGoto } from './testProcessThenGoto.js';
import { testScanTokensToCode } from './testScanTokensToCode.js';
import { testStripBASICCommentsAndEmptyStringLiterals } from
'./testStripBASICCommentsAndEmptyStringLiterals.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testGenericProcessToFromMultipleSourceTokens,
		testInsertSpacesAfterIntegerLabels,
		testProcessThenGoto,
		testScanTokensToCode,
		testStripBASICCommentsAndEmptyStringLiterals
	], logger);
};