import { testIsLikelyPBasic } from './testIsLikelyPBasic.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testPBasic(logger) {
	wrapAndCall([
		testIsLikelyPBasic,
		testTranslationToWebLogo
	], logger);
};