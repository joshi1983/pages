import { testHasNoChildrenValueToken } from
'./testHasNoChildrenValueToken.js';
import { testProcessSimpleLineCases } from
'./testProcessSimpleLineCases.js';
import { testRemoveCommasStartingParameterLists } from
'./testRemoveCommasStartingParameterLists.js';
import { testSplitTokensEndingWithNumbers } from
'./testSplitTokensEndingWithNumbers.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testScanTokenProcessors(logger) {
	wrapAndCall([
		testHasNoChildrenValueToken,
		testProcessSimpleLineCases,
		testRemoveCommasStartingParameterLists,
		testSplitTokensEndingWithNumbers
	], logger);
};