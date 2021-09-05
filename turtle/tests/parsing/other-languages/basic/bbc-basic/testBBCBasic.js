import { testIsLikelyBBCBasic } from 
'./testIsLikelyBBCBasic.js';
import { testScanning } from
'./scanning/testScanning.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from 
'../../../../helpers/wrapAndCall.js';

export function testBBCBasic(logger) {
	return wrapAndCall([
		testIsLikelyBBCBasic,
		testScanning,
		testTranslationToWebLogo
	], logger);
};