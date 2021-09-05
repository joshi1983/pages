import { testTranslateSinclairBasicToWebLogo } from './testTranslateSinclairBasicToWebLogo.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateSinclairBasicToWebLogo,
		testTranslateVariousExamples
	], logger);
};