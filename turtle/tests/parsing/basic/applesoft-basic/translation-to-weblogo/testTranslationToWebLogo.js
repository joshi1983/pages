import { testTranslateAppleSoftBasicToQBasic } from
'./testTranslateAppleSoftBasicToQBasic.js';
import { testTranslateAppleSoftBasicToWebLogo } from
'./testTranslateAppleSoftBasicToWebLogo.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateAppleSoftBasicToQBasic,
		testTranslateAppleSoftBasicToWebLogo
	], logger);
};