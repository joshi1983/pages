import { testTranslateAmosBasicToWebLogo } from './testTranslateAmosBasicToWebLogo.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateAmosBasicToWebLogo,
		testTranslateVariousExamples
	], logger);
};