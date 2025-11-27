/*import { testColours } from './testColours.js';
import { testColoursTXT } from './testColoursTXT.js';
import { testIsLikelyPythonCode } from './testIsLikelyPythonCode.js';
*/import { testNewTranslationToWebLogo } from './new-translation-to-weblogo/testNewTranslationToWebLogo.js';
/*import { testOperatorsData } from './testOperatorsData.js';
import { testParseTreeAnalysis } from './parse-tree-analysis/testParseTreeAnalysis.js';
import { testParseTreeTokenType } from './testParseTreeTokenType.js';
import { testParseWithParseTreeTokenTypes } from './testParseWithParseTreeTokenTypes.js';
import { testParsing } from './parsing/testParsing.js';
import { testPythonOperators } from './testPythonOperators.js';
import { testPythonTurtleJSON } from './testPythonTurtleJSON.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslateAllExamples } from './testTranslateAllExamples.js';
*/import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testPythonParsing(logger) {
	wrapAndCall([/*
		testColours,
		testColoursTXT,
		testIsLikelyPythonCode,*/
		testNewTranslationToWebLogo,/*
		testOperatorsData,
		testParseTreeAnalysis,
		testParseTreeTokenType,
		testParseWithParseTreeTokenTypes,
		testParsing,
		testPythonOperators,
		testPythonTurtleJSON,
		testScanning,
		testTranslateAllExamples*/
	], logger);
};