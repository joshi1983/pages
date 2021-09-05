import { testIsLikelyTektronix405XBasic } from
'./testIsLikelyTektronix405XBasic.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTektronix405xBasic(logger) {
	wrapAndCall([
		testIsLikelyTektronix405XBasic,
		testTranslationToWebLogo
	], logger);
};