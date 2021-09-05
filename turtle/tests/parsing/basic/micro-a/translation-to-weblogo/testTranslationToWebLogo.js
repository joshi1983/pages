import { testExecute } from './testExecute.js';
import { testTranslate } from './testTranslate.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecute,
		testTranslate,
		testTranslateVariousExamples
	], logger);
};