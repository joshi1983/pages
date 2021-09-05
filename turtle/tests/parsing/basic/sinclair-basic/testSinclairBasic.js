import { testIsLikelySinclairBasic } from
'./testIsLikelySinclairBasic.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testSinclairBasic(logger) {
	wrapAndCall([
		testIsLikelySinclairBasic,
		testTranslationToWebLogo
	], logger);
};