import { testTranslateFunctionCalls } from './testTranslateFunctionCalls.js';
import { testTranslateRemove } from './testTranslateRemove.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateFunctionCalls,
		testTranslateRemove,
		testTranslateVariousExamples
	], logger);
};