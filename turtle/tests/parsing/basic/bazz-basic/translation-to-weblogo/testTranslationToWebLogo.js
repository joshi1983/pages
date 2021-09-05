import { testTranslateRemove } from './testTranslateRemove.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateRemove,
		testTranslateVariousExamples
	], logger);
};