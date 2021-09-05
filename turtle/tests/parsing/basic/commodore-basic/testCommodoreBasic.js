import { testIsLikelyCommodoreBasic } from
'./testIsLikelyCommodoreBasic.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testCommodoreBasic(logger) {
	wrapAndCall([
		testIsLikelyCommodoreBasic,
		testTranslationToWebLogo
	], logger);
};