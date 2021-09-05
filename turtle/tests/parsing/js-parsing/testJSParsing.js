import { testEvaluateStringLiteral } from './testEvaluateStringLiteral.js';
import { testEvaluateTemplateLiteral } from './testEvaluateTemplateLiteral.js';
import { testEvaluators } from './evaluators/testEvaluators.js';
import { testMightHaveSideEffects } from './testMightHaveSideEffects.js';
import { testOperatorsJSON } from './testOperatorsJSON.js';
import { testParse } from './testParse.js';
import { testParseArrayLiterals } from './testParseArrayLiterals.js';
import { testParseArrowFunctions } from './testParseArrowFunctions.js';
import { testParseAssignments } from './testParseAssignments.js';
import { testParseAwait } from './testParseAwait.js';
import { testParseBinaryOperators } from './testParseBinaryOperators.js';
import { testParseClassDefinitions } from './testParseClassDefinitions.js';
import { testParseCodeBlocks } from './testParseCodeBlocks.js';
import { testParseComments } from './testParseComments.js';
import { testParseCurlyBrackets } from './testParseCurlyBrackets.js';
import { testParseCurvedBracketExpression } from './testParseCurvedBracketExpression.js';
import { testParseDeclarations } from './testParseDeclarations.js';
import { testParseDelete } from './testParseDelete.js';
import { testParseDot } from './testParseDot.js';
import { testParseDoWhileLoops } from './testParseDoWhileLoops.js';
import { testParseErroneousJavaScript } from './testParseErroneousJavaScript.js';
import { testParseExportStatements } from './testParseExportStatements.js';
import { testParseExpressions } from './testParseExpressions.js';
import { testParseForLoops } from './testParseForLoops.js';
import { testParseFunctionCalls } from './testParseFunctionCalls.js';
import { testParseFunctionDefinitions } from './testParseFunctionDefinitions.js';
import { testParseIfStatements } from './testParseIfStatements.js';
import { testParseImports } from './testParseImports.js';
import { testParseIndexExpression } from './testParseIndexExpression.js';
import { testParseIndexExpressionIndex } from './testParseIndexExpressionIndex.js';
import { testParseInOperator } from './testParseInOperator.js';
import { testParseJavaScriptFromExamples } from './testParseJavaScriptFromExamples.js';
import { testParseRegularExpressions } from './testParseRegularExpressions.js';
import { testParseSpecialValues } from './testParseSpecialValues.js';
import { testParseSwitchStatements } from './testParseSwitchStatements.js';
import { testParseTernaryOperator } from './testParseTernaryOperator.js';
import { testParseTreeTokensToCode } from './testParseTreeTokensToCode.js';
import { testParseTryCatch } from './testParseTryCatch.js';
import { testParseUnaryOperators } from './testParseUnaryOperators.js';
import { testParseVariousJavaScriptFiles } from './testParseVariousJavaScriptFiles.js';
import { testParseWebLogoJavaScript } from './testParseWebLogoJavaScript.js';
import { testParseWith } from './testParseWith.js';
import { testParseWhileLoops } from './testParseWhileLoops.js';
import { testParsing } from './parsing/testParsing.js';
import { testReservedWord } from './testReservedWord.js';
import { testReservedWordsJSON } from './testReservedWordsJSON.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testJSParsing(logger) {
	wrapAndCall([
		testEvaluateStringLiteral,
		testEvaluateTemplateLiteral,
		testEvaluators,
		testMightHaveSideEffects,
		testOperatorsJSON,
		testParse,
		testParseArrayLiterals,
		testParseArrowFunctions,
		testParseAssignments,
		testParseAwait,
		testParseBinaryOperators,
		testParseClassDefinitions,
		testParseCodeBlocks,
		testParseComments,
		testParseCurlyBrackets,
		testParseCurvedBracketExpression,
		testParseDeclarations,
		testParseDelete,
		testParseDot,
		testParseDoWhileLoops,
		testParseErroneousJavaScript,
		testParseExportStatements,
		testParseExpressions,
		testParseForLoops,
		testParseFunctionCalls,
		testParseFunctionDefinitions,
		testParseIfStatements,
		testParseImports,
		testParseIndexExpression,
		testParseIndexExpressionIndex,
		testParseInOperator,
		testParseJavaScriptFromExamples,
		testParseRegularExpressions,
		testParseSpecialValues,
		testParseSwitchStatements,
		testParseTernaryOperator,
		testParseTreeTokensToCode,
		testParseTryCatch,
		testParseUnaryOperators,
		testParseVariousJavaScriptFiles,
		testParseWebLogoJavaScript,
		testParseWith,
		testParseWhileLoops,
		testParsing,
		testReservedWord,
		testReservedWordsJSON,
		testScanning,
		testTranslationToWebLogo
	], logger);
};