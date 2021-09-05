import { testTranslateFor } from './testTranslateFor.js';
import { testTranslateFunctionCalls } from './testTranslateFunctionCalls.js';
import { testTranslateFunctionDefinitions } from './testTranslateFunctionDefinitions.js';
import { testTranslateIf } from './testTranslateIf.js';
import { testTranslateWhile } from './testTranslateWhile.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateFor,
		testTranslateFunctionCalls,
		testTranslateFunctionDefinitions,
		testTranslateIf,
		testTranslateWhile,
		testTranslateVariousExamples
	], logger);
};