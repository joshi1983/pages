import { testIsLikelyBasicFusion } from
'./testIsLikelyBasicFusion.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testBasicFusion(logger) {
	wrapAndCall([
		testIsLikelyBasicFusion,
		testTranslationToWebLogo
	], logger);
};