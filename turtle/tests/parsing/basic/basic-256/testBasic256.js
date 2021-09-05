import { testIsLikelyBasic256 } from './testIsLikelyBasic256.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testBasic256(logger) {
	wrapAndCall([
		testIsLikelyBasic256,
		testScanning,
		testTranslationToWebLogo
	], logger);
};