import { testIsLikelyProcessing } from './testIsLikelyProcessing.js';
import { testOperatorsJSON } from './testOperatorsJSON.js';
import { testParseAssignments } from './testParseAssignments.js';
import { testParseBinaryOperators } from './testParseBinaryOperators.js';
import { testParseCodeBlocks } from './testParseCodeBlocks.js';
import { testParseComments } from './testParseComments.js';
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
import { testParseMethodCalls } from './testParseMethodCalls.js';
import { testParseMethodDefinitions } from './testParseMethodDefinitions.js';
import { testParseSpecialValues } from './testParseSpecialValues.js';
import { testParseSwitchStatements } from './testParseSwitchStatements.js';
import { testParseTernaryOperator } from './testParseTernaryOperator.js';
import { testParseTryCatch } from './testParseTryCatch.js';
import { testParseUnaryOperators } from './testParseUnaryOperators.js';
import { testReservedWordsJSON } from './testReservedWordsJSON.js';
import { testParseWhileLoops  } from './testParseWhileLoops.js';
import { testScanning } from './scanning/testScanning.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testProcessing(logger) {
	wrapAndCall([
		testParseDoWhileLoops,
		testIsLikelyProcessing,
		testOperatorsJSON,
		testParseAssignments,
		testParseBinaryOperators,
		testParseCodeBlocks,
		testParseComments,
		testParseCurlyBrackets,
		testParseDeclarations,
		testParseDot,
		testParseExamples,
		testParseExpressions,
		testParseForLoops,
		testParseIfStatements,
		testParseImports,
		testParseIndexExpression,
		testParseIndexExpressionIndex,
		testParseMethodCalls,
		testParseMethodDefinitions,
		testParseSpecialValues,
		testParseSwitchStatements,
		testParseTernaryOperator,
		testParseTryCatch,
		testParseUnaryOperators,
		testParseWhileLoops,
		testReservedWordsJSON,
		testScanning
	], logger);
};