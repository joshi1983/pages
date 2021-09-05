import { testIsLikelyCGJennings } from './testIsLikelyCGJennings.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCGJennings(logger) {
	wrapAndCall([
		testIsLikelyCGJennings,
		testScanning,
		testTranslationToWebLogo
	], logger);
};