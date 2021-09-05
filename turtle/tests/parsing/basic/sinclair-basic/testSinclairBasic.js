import { testIsLikelySinclairBasic } from
'./testIsLikelySinclairBasic.js';
import { testScanning } from
'./scanning/testScanning.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testSinclairBasic(logger) {
	wrapAndCall([
		testIsLikelySinclairBasic,
		testScanning,
		testTranslationToWebLogo
	], logger);
};