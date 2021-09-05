import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testParseInvalidPythonCode } from './testParseInvalidPythonCode.js';
import { testIsLikelyPythonCode } from './testIsLikelyPythonCode.js';
import { testParse } from './testParse.js';
import { testParseTreeAnalysis } from './parse-tree-analysis/testParseTreeAnalysis.js';
import { testParseTreeConversion } from './parse-tree-conversion/testParseTreeConversion.js';
import { testParseTreeTokenType } from './testParseTreeTokenType.js';
import { testParseWithParseTreeTokenTypes } from './testParseWithParseTreeTokenTypes.js';
import { testParseVariousPythonScriptsWithoutJavaScriptError } from './testParseVariousPythonScriptsWithoutJavaScriptError.js';
import { testPythonTurtleJSON } from './testPythonTurtleJSON.js';
import { testRefactoring } from './refactoring/testRefactoring.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';

export function testPythonParsing(logger) {
	testIsLikelyPythonCode(prefixWrapper('testIsLikelyPythonCode', logger));
	testParse(prefixWrapper('testParse', logger));
	testParseInvalidPythonCode(prefixWrapper('testParseInvalidPythonCode', logger));
	testParseTreeAnalysis(prefixWrapper('testParseTreeAnalysis', logger));
	testParseTreeConversion(prefixWrapper('testParseTreeConversion', logger));
	testParseTreeTokenType(prefixWrapper('testParseTreeTokenType', logger));
	testParseWithParseTreeTokenTypes(prefixWrapper('testParseWithParseTreeTokenTypes', logger));
	testParseVariousPythonScriptsWithoutJavaScriptError(prefixWrapper('testParseVariousPythonScriptsWithoutJavaScriptError', logger));
	testPythonTurtleJSON(prefixWrapper('testPythonTurtleJSON', logger));
	testRefactoring(prefixWrapper('testRefactoring', logger));
	testTranslationToWebLogo(prefixWrapper('testTranslationToWebLogo', logger));
};