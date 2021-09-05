import { testIsLikelyAmosBasic } from './testIsLikelyAmosBasic.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testAmosBasic(logger) {
	wrapAndCall([
		testIsLikelyAmosBasic,
		testScanning,
		testTranslationToWebLogo
	], logger);
};