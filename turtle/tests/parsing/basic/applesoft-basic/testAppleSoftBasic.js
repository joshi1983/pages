import { testIsLikelyAppleSoftBasic } from './testIsLikelyAppleSoftBasic.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testAppleSoftBasic(logger) {
	wrapAndCall([
		testIsLikelyAppleSoftBasic,
		testTranslationToWebLogo
	], logger);
};