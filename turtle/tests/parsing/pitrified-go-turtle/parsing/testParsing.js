import { testParseArrayLiteral } from './testParseArrayLiteral.js';
import { testParseArraySubscript } from './testParseArraySubscript.js';
import { testParseAssignments } from './testParseAssignments.js';
import { testParseBinaryOperators } from './testParseBinaryOperators.js';
import { testParseCase } from './testParseCase.js';
import { testParseCommaExpression } from './testParseCommaExpression.js';
import { testParseComments } from './testParseComments.js';
import { testParseCurvedBracketExpression } from './testParseCurvedBracketExpression.js';
import { testParseDataTypeExpression } from './testParseDataTypeExpression.js';
import { testParseDot } from './testParseDot.js';
import { testParseEllipsis } from './testParseEllipsis.js';
import { testParseExpressionDotProperty } from './testParseExpressionDotProperty.js';
import { testParseFor } from './testParseFor.js';
import { testParseFunc } from './testParseFunc.js';
import { testParseFuncCall } from './testParseFuncCall.js';
import { testParseGoto } from './testParseGoto.js';
import { testParseIf } from './testParseIf.js';
import { testParseImport } from './testParseImport.js';
import { testParseInterface } from './testParseInterface.js';
import { testParseLabel } from './testParseLabel.js';
import { testParsePackage } from './testParsePackage.js';
import { testParseSelect } from './testParseSelect.js';
import { testParseStruct } from './testParseStruct.js';
import { testParseSwitch } from './testParseSwitch.js';
import { testParseTreeAnalysis } from './parse-tree-analysis/testParseTreeAnalysis.js';
import { testParseUnaryOperator } from './testParseUnaryOperator.js';
import { testParseVar } from './testParseVar.js';
import { testParseVariousExamples } from './testParseVariousExamples.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testParseArrayLiteral,
		testParseArraySubscript,
		testParseAssignments,
		testParseBinaryOperators,
		testParseCase,
		testParseCommaExpression,
		testParseComments,
		testParseCurvedBracketExpression,
		testParseDataTypeExpression,
		testParseDot,
		testParseEllipsis,
		testParseExpressionDotProperty,
		testParseFor,
		testParseFunc,
		testParseFuncCall,
		testParseGoto,
		testParseIf,
		testParseImport,
		testParseInterface,
		testParseLabel,
		testParsePackage,
		testParseSelect,
		testParseStruct,
		testParseSwitch,
		testParseTreeAnalysis,
		testParseUnaryOperator,
		testParseVar,
		testParseVariousExamples
	], logger);
};