import { testCanEvaluateToDataValue } from
'./testCanEvaluateToDataValue.js';
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
import { testParseFor } from
'./testParseFor.js';
import { testParseFunction } from
'./testParseFunction.js';
import { testParseFunctionCall } from
'./testParseFunctionCall.js';
import { testParseIf } from
'./testParseIf.js';
import { testParseLoop } from
'./testParseLoop.js';
import { testParseProcedure } from
'./testParseProcedure.js';
import { testParseUnaryOperator } from
'./testParseUnaryOperator.js';
import { testParseVar } from
'./testParseVar.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testCanEvaluateToDataValue,
		testParseCase,
		testParseClass,
		testParseConst,
		testParseEndMatchSymbol,
		testParseExit,
		testParseExport,
		testParseExpressionDotProperty,
		testParseFor,
		testParseFunction,
		testParseFunctionCall,
		testParseIf,
		testParseLoop,
		testParseProcedure,
		testParseUnaryOperator,
		testParseVar
	], logger);
};