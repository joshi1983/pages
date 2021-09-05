import { testCommandSymbolsJSON } from
'./testCommandSymbolsJSON.js';
import { testEvaluation } from
'./evaluation/testEvaluation.js';
import { testIsLikely0L } from
'./testIsLikely0L.js';
import { testParseArrow } from
'./testParseArrow.js';
import { testParseAssignment } from
'./testParseAssignment.js';
import { testParseAxiom } from 
'./testParseAxiom.js';
import { testParseVariousExamples } from
'./testParseVariousExamples.js';
import { testPropertiesJSON } from
'./testPropertiesJSON.js';
import { testScanning } from
'./scanning/testScanning.js';
import { testStringifyZeroLCode } from
'./testStringifyZeroLCode.js';
import { testScanTokenToParseTreeToken } from
'./testScanTokenToParseTreeToken.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function test0L(logger) {
	wrapAndCall([
		testCommandSymbolsJSON,
		testEvaluation,
		testIsLikely0L,
		testParseArrow,
		testParseAssignment,
		testParseAxiom,
		testParseVariousExamples,
		testPropertiesJSON,
		testScanning,
		testScanTokenToParseTreeToken,
		testStringifyZeroLCode,
		testTranslationToWebLogo
	], logger);
};