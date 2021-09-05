/*import { testIsLikelyPythonCode } from './testIsLikelyPythonCode.js';
import { testParse } from './testParse.js';
import { testParseInvalidPythonCode } from './testParseInvalidPythonCode.js';
import { testParseTreeAnalysis } from './parse-tree-analysis/testParseTreeAnalysis.js';
import { testParseTreeConversion } from './parse-tree-conversion/testParseTreeConversion.js';
import { testParseTreeTokenType } from './testParseTreeTokenType.js';
import { testParseWithParseTreeTokenTypes } from './testParseWithParseTreeTokenTypes.js';
import { testParseVariousPythonScriptsWithoutJavaScriptError } from './testParseVariousPythonScriptsWithoutJavaScriptError.js';
import { testPythonTurtleJSON } from './testPythonTurtleJSON.js';
import { testRefactoring } from './refactoring/testRefactoring.js';
*/import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testPythonParsing(logger) {
	wrapAndCall([
		/*testIsLikelyPythonCode,
		testParse,
		testParseInvalidPythonCode,
		testParseTreeAnalysis,
		testParseTreeConversion,
		testParseTreeTokenType,
		testParseWithParseTreeTokenTypes,
		testParseVariousPythonScriptsWithoutJavaScriptError,
		testPythonTurtleJSON,
		testRefactoring,
		*/testTranslationToWebLogo
	], logger);
};