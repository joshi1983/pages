import { testColorsJSON } from './testColorsJSON.js';
import { testEvaluation } from './evaluation/testEvaluation.js';
import { testGetFunctionsMap } from './testGetFunctionsMap.js';
import { testIsLikelyQBasic } from './testIsLikelyQBasic.js';
import { testParseAs } from './testParseAs.js';
import { testParseAssignment } from './testParseAssignment.js';
import { testParseBadQBasicCode } from './testParseBadQBasicCode.js';
import { testParseBinaryOperators } from './testParseBinaryOperators.js';
import { testParseCall } from './testParseCall.js';
import { testParseComma } from './testParseComma.js';
import { testParseCommon } from './testParseCommon.js';
import { testParseCompositeIdentifier } from './testParseCompositeIdentifier.js';
import { testParseCurvedBracketExpressions } from './testParseCurvedBracketExpressions.js';
import { testParseDeclarations } from './testParseDeclarations.js';
import { testParseDef } from './testParseDef.js';
import { testParseDim } from './testParseDim.js';
import { testParseDoLoop } from './testParseDoLoop.js';
import { testParseDoLoopWhile } from './testParseDoLoopWhile.js';
import { testParseDoUntil } from './testParseDoUntil.js';
import { testParseDoWhileLoop } from './testParseDoWhileLoop.js';
import { testParseExit } from './testParseExit.js';
import { testParseElseif } from './testParseElseif.js';
import { testParseExpressionDot } from './testParseExpressionDot.js';
import { testParseForLoop } from './testParseForLoop.js';
import { testParseFunctionCalls } from './testParseFunctionCalls.js';
import { testParseFunctionDefinitions } from './testParseFunctionDefinitions.js';
import { testParseGet } from './testParseGet.js';
import { testParseGosub } from './testParseGosub.js';
import { testParseGoto } from './testParseGoto.js';
import { testParseGraphicsStep } from './testParseGraphicsStep.js';
import { testParseIf } from './testParseIf.js';
import { testParseLabel } from './testParseLabel.js';
import { testParseLine } from './testParseLine.js';
import { testParseNext } from './testParseNext.js';
import { testParseOn } from './testParseOn.js';
import { testParseOpen } from './testParseOpen.js';
import { testParsePrintStatements } from './testParsePrintStatements.js';
import { testParseSelect } from './testParseSelect.js';
import { testParseShared } from './testParseShared.js';
import { testParseSubroutines } from './testParseSubroutines.js';
import { testParseTreeToCode } from
'./testParseTreeToCode.js';
import { testParseTrueFalse } from './testParseTrueFalse.js';
import { testParseTupleLiteral } from './testParseTupleLiteral.js';
import { testParseType } from './testParseType.js';
import { testParseUnaryOperators } from './testParseUnaryOperators.js';
import { testParseVariousExamples } from './testParseVariousExamples.js';
import { testParseWhile } from './testParseWhile.js';
import { testParseWindow } from './testParseWindow.js';
import { testParsing } from './parsing/testParsing.js';
import { testQBasicColors } from './testQBasicColors.js';
import { testQBasicInternalFunctions } from './testQBasicInternalFunctions.js';
import { testQBasicOperators } from './testQBasicOperators.js';
import { testScanning } from './scanning/testScanning.js';
import { testShouldBooleanLiteralsBeIdentifiers } from
'./testShouldBooleanLiteralsBeIdentifiers.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testQBasic(logger) {
	wrapAndCall([
		testColorsJSON,
		testEvaluation,
		testGetFunctionsMap,
		testIsLikelyQBasic,
		testParseAs,
		testParseAssignment,
		testParseBadQBasicCode,
		testParseBinaryOperators,
		testParseCall,
		testParseComma,
		testParseCommon,
		testParseCompositeIdentifier,
		testParseCurvedBracketExpressions,
		testParseDeclarations,
		testParseDef,
		testParseDim,
		testParseDoLoop,
		testParseDoLoopWhile,
		testParseDoUntil,
		testParseDoWhileLoop,
		testParseElseif,
		testParseExit,
		testParseExpressionDot,
		testParseForLoop,
		testParseFunctionCalls,
		testParseFunctionDefinitions,
		testParseGet,
		testParseGosub,
		testParseGoto,
		testParseGraphicsStep,
		testParseIf,
		testParseLabel,
		testParseLine,
		testParseNext,
		testParseOn,
		testParseOpen,
		testParsePrintStatements,
		testParseSelect,
		testParseShared,
		testParseSubroutines,
		testParseTreeToCode,
		testParseTrueFalse,
		testParseTupleLiteral,
		testParseType,
		testParseUnaryOperators,
		testParseVariousExamples,
		testParseWhile,
		testParseWindow,
		testParsing,
		testQBasicColors,
		testQBasicInternalFunctions,
		testQBasicOperators,
		testScanning,
		testShouldBooleanLiteralsBeIdentifiers,
		testTranslationToWebLogo
	], logger);
};