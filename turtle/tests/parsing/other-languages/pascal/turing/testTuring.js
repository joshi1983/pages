import { testIsLikelyTuring } from './testIsLikelyTuring.js';
import { testParsing } from './parsing/testParsing.js';
import { testScanning } from
'./scanning/testScanning.js';
import { testScanTokenToParseTreeToken } from
'./testScanTokenToParseTreeToken.js';
import { testScanTokenToParseTreeTokenVariousExamples } from
'./testScanTokenToParseTreeTokenVariousExamples.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTuring(logger) {
	wrapAndCall([
		testIsLikelyTuring,
		testParsing,
		testScanning,
		testScanTokenToParseTreeToken,
		testScanTokenToParseTreeTokenVariousExamples,
		testTranslationToWebLogo
	], logger);
};