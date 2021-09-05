import { testIsLikelyTexasInstruments99_4a } from
'./testIsLikelyTexasInstruments99_4a.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTexasInstruments99_4a(logger) {
	wrapAndCall([
		testIsLikelyTexasInstruments99_4a,
		testTranslationToWebLogo
	], logger);
};