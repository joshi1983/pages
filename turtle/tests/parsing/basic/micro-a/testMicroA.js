import { testIsLikelyMicroABasic } from './testIsLikelyMicroABasic.js';
import { testParseFunctionCalls } from './testParseFunctionCalls.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testMicroA(logger) {
	wrapAndCall([
		testIsLikelyMicroABasic,
		testParseFunctionCalls,
		testScanning,
		testTranslationToWebLogo
	], logger);
};