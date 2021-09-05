import { testTranslateAppleSoftBasicToQBasic } from
'./testTranslateAppleSoftBasicToQBasic.js';
import { testTranslateAppleSoftBasicToWebLogo } from
'./testTranslateAppleSoftBasicToWebLogo.js';
import { testTranslateVariousExamples } from
'./testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateAppleSoftBasicToQBasic,
		testTranslateAppleSoftBasicToWebLogo,
		testTranslateVariousExamples
	], logger);
};