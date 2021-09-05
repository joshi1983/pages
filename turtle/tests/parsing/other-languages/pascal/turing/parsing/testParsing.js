import { testCanEvaluateToDataValue } from
'./testCanEvaluateToDataValue.js';
import { testParseArray } from
'./testParseArray.js';
import { testParseAssert } from
'./testParseAssert.js';
import { testParseCase } from
'./testParseCase.js';
import { testParseClass } from
'./testParseClass.js';
import { testParseConst } from
'./testParseConst.js';
import { testParseEndMatchSymbol } from
'./testParseEndMatchSymbol.js';
import { testParseExit } from
'./testParseExit.js';
import { testParseExport } from
'./testParseExport.js';
import { testParseExpressionDotProperty } from
'./testParseExpressionDotProperty.js';
import { testParseExternal } from
'./testParseExternal.js';
import { testParseFor } from
'./testParseFor.js';
import { testParseFork } from
'./testParseFork.js';
import { testParseFunction } from
'./testParseFunction.js';
import { testParseFunctionCall } from
'./testParseFunctionCall.js';
import { testParseIf } from
'./testParseIf.js';
import { testParseLabel } from
'./testParseLabel.js';
import { testParseLoop } from
'./testParseLoop.js';
import { testParseModule } from
'./testParseModule.js';
import { testParseProcedure } from
'./testParseProcedure.js';
import { testParseProcess } from
'./testParseProcess.js';
import { testParseRange } from
'./testParseRange.js';
import { testParseTreeAnalysis } from
'./parse-tree-analysis/testParseTreeAnalysis.js';
import { testParseType } from
'./testParseType.js';
import { testParseUnaryOperator } from
'./testParseUnaryOperator.js';
import { testParseUnion } from
'./testParseUnion.js';
import { testParseVar } from
'./testParseVar.js';
import { testParseVariousExamples } from
'./testParseVariousExamples.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testCanEvaluateToDataValue,
		testParseArray,
		testParseAssert,
		testParseCase,
		testParseClass,
		testParseConst,
		testParseEndMatchSymbol,
		testParseExit,
		testParseExport,
		testParseExpressionDotProperty,
		testParseExternal,
		testParseFor,
		testParseFork,
		testParseFunction,
		testParseFunctionCall,
		testParseIf,
		testParseLabel,
		testParseLoop,
		testParseModule,
		testParseProcedure,
		testParseProcess,
		testParseRange,
		testParseTreeAnalysis,
		testParseType,
		testParseUnaryOperator,
		testParseUnion,
		testParseVar,
		testParseVariousExamples
	], logger);
};