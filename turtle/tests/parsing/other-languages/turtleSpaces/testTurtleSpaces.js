import { testIsLikelyTurtleSpaces } from './testIsLikelyTurtleSpaces.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTurtleSpaces(logger) {
	wrapAndCall([
		testIsLikelyTurtleSpaces,
		testScanning,
		testTranslationToWebLogo
	], logger);
};