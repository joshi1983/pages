import { testIsLikelyHTBasic } from
'./testIsLikelyHTBasic.js';
import { testScanning } from
'./scanning/testScanning.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testHTBasic(logger) {
	wrapAndCall([
		testIsLikelyHTBasic,
		testScanning,
		testTranslationToWebLogo
	], logger);
};