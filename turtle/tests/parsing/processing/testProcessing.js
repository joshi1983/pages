import { testIdentifiersJSON } from './testIdentifiersJSON.js';
import { testIsLikelyProcessing } from './testIsLikelyProcessing.js';
import { testMethodsJSON } from './testMethodsJSON.js';
import { testNumberLiteralToValue } from './testNumberLiteralToValue.js';
import { testOperatorsJSON } from './testOperatorsJSON.js';
import { testParseAssignments } from './testParseAssignments.js';
import { testParseBinaryOperators } from './testParseBinaryOperators.js';
import { testParseBreak } from './testParseBreak.js';
import { testParseClassDefinitions } from './testParseClassDefinitions.js';
import { testParseCodeBlocks } from './testParseCodeBlocks.js';
import { testParseComments } from './testParseComments.js';
import { testParseContinue } from './testParseContinue.js';
import { testParseCurlyBrackets } from './testParseCurlyBrackets.js';
import { testParseDeclarations } from './testParseDeclarations.js';
import { testParseDot } from './testParseDot.js';
import { testParseDoWhileLoops } from './testParseDoWhileLoops.js';
import { testParseExamples } from './testParseExamples.js';
import { testParseExpressions } from './testParseExpressions.js';
import { testParseForLoops } from './testParseForLoops.js';
import { testParseIfStatements } from './testParseIfStatements.js';
import { testParseImports } from './testParseImports.js';
import { testParseIndexExpression } from './testParseIndexExpression.js';
import { testParseIndexExpressionIndex } from './testParseIndexExpressionIndex.js';
import { testParseInterfaceDefinitions } from './testParseInterfaceDefinitions.js';
import { testParseMethodCalls } from './testParseMethodCalls.js';
import { testParseMethodDefinitions } from './testParseMethodDefinitions.js';
import { testParseNew } from './testParseNew.js';
import { testParseNoThrownExceptions } from './testParseNoThrownExceptions.js';
import { testParseSpecialValues } from './testParseSpecialValues.js';
import { testParseSwitchStatements } from './testParseSwitchStatements.js';
import { testParseTernaryOperator } from './testParseTernaryOperator.js';
import { testParseTryCatch } from './testParseTryCatch.js';
import { testParseTypeCasting } from './testParseTypeCasting.js';
import { testParseUnaryOperators } from './testParseUnaryOperators.js';
import { testParseWhileLoops  } from './testParseWhileLoops.js';
import { testParsing  } from './parsing/testParsing.js';
import { testProcessingMethod } from './testProcessingMethod.js';
import { testReservedWordsJSON } from './testReservedWordsJSON.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testProcessing(logger) {
	wrapAndCall([
		testIdentifiersJSON,
		testIsLikelyProcessing,
		testMethodsJSON,
		testNumberLiteralToValue,
		testOperatorsJSON,
		testParseAssignments,
		testParseBinaryOperators,
		testParseBreak,
		testParseClassDefinitions,
		testParseCodeBlocks,
		testParseComments,
		testParseContinue,
		testParseCurlyBrackets,
		testParseDeclarations,
		testParseDot,
		testParseDoWhileLoops,
		testParseExamples,
		testParseExpressions,
		testParseForLoops,
		testParseIfStatements,
		testParseImports,
		testParseIndexExpression,
		testParseIndexExpressionIndex,
		testParseInterfaceDefinitions,
		testParseMethodCalls,
		testParseMethodDefinitions,
		testParseNew,
		testParseNoThrownExceptions,
		testParseSpecialValues,
		testParseSwitchStatements,
		testParseTernaryOperator,
		testParseTryCatch,
		testParseTypeCasting,
		testParseUnaryOperators,
		testParseWhileLoops,
		testParsing,
		testProcessingMethod,
		testReservedWordsJSON,
		testScanning,
		testTranslationToWebLogo
	], logger);
};