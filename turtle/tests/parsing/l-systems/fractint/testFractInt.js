import { testIsLikelyFractInt } from './testIsLikelyFractInt.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testFractInt(logger) {
	wrapAndCall([
		testIsLikelyFractInt,
		testScanning,
		testTranslationToWebLogo
	], logger);
};