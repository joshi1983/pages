import { testColours } from './testColours.js';
import { testColoursTXT } from './testColoursTXT.js';
import { testIsLikelyPythonCode } from './testIsLikelyPythonCode.js';
import { testParse } from './testParse.js';
import { testParseInvalidPythonCode } from './testParseInvalidPythonCode.js';
import { testParseTreeAnalysis } from './parse-tree-analysis/testParseTreeAnalysis.js';
import { testParseTreeConversion } from './parse-tree-conversion/testParseTreeConversion.js';
import { testParseTreeTokenType } from './testParseTreeTokenType.js';
import { testParseWithChecks } from './testParseWithChecks.js';
import { testParseWithParseTreeTokenTypes } from './testParseWithParseTreeTokenTypes.js';
import { testParseVariousPythonScriptsWithoutJavaScriptError } from './testParseVariousPythonScriptsWithoutJavaScriptError.js';
import { testPythonTurtleJSON } from './testPythonTurtleJSON.js';
import { testRefactoring } from './refactoring/testRefactoring.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testPythonParsing(logger) {
	wrapAndCall([
		testColours,
		testColoursTXT,
		testIsLikelyPythonCode,
		testParse,
		testParseInvalidPythonCode,
		testParseTreeAnalysis,
		testParseTreeConversion,
		testParseTreeTokenType,
		testParseWithChecks,
		testParseWithParseTreeTokenTypes,
		testParseVariousPythonScriptsWithoutJavaScriptError,
		testPythonTurtleJSON,
		testRefactoring,
		testTranslationToWebLogo
	], logger);
};