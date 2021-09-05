import { testTranslateFunctionCalls } from
'./testTranslateFunctionCalls.js';
import { testTranslateVariousExamples } from
'./testTranslateVariousExamples.js';
import { testTypeProcessors } from
'./type-processors/testTypeProcessors.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateFunctionCalls,
		testTranslateVariousExamples,
		testTypeProcessors
	], logger);
};