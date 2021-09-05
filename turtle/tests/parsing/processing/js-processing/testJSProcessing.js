import { testFunctionsJSON } from './testFunctionsJSON.js';
import { testIsLikelyJavaScriptProcessing } from './testIsLikelyJavaScriptProcessing.js';
import { testParseAllJSProcessingExamples } from './testParseAllJSProcessingExamples.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testJSProcessing(logger) {
	wrapAndCall([
		testFunctionsJSON,
		testIsLikelyJavaScriptProcessing,
		testParseAllJSProcessingExamples,
		testTranslationToWebLogo
	], logger);
};