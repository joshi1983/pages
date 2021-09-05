import { testSplitCompleteNumberPrefix } from
'./testSplitCompleteNumberPrefix.js';
import { testSplitDefTypePrefix } from
'./testSplitDefTypePrefix.js';
import { testSplitDimPrefix } from
'./testSplitDimPrefix.js';
import { testSplitForPrefix } from
'./testSplitForPrefix.js';
import { testSplitStepPrefix } from
'./testSplitStepPrefix.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTokenSanitizers(logger) {
	wrapAndCall([
		testSplitCompleteNumberPrefix,
		testSplitDefTypePrefix,
		testSplitDimPrefix,
		testSplitForPrefix,
		testSplitStepPrefix
	], logger);
};