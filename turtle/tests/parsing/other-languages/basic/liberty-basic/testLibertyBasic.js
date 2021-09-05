import { testIsLikelyLibertyBasic } from
'./testIsLikelyLibertyBasic.js';
import { testScanning } from
'./scanning/testScanning.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testLibertyBasic(logger) {
	wrapAndCall([
		testIsLikelyLibertyBasic,
		testScanning,
		testTranslationToWebLogo
	], logger);
};