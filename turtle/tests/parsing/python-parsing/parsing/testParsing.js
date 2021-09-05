import { testCodeSanitizers } from './code-sanitizers/testCodeSanitizers.js';
import { testParseBinaryOperator } from './testParseBinaryOperator.js';
import { testParseClass } from './testParseClass.js';
import { testParseCommaExpression } from './testParseCommaExpression.js';
import { testParseCurvedBracketExpression } from './testParseCurvedBracketExpression.js';
import { testParseDecorator } from './testParseDecorator.js';
import { testParseDictionaryLiteral } from './testParseDictionaryLiteral.js';
import { testParseDocstring } from './testParseDocstring.js';
import { testParseDot } from './testParseDot.js';
import { testParseExamples } from './testParseExamples.js';
import { testParseForLoop } from './testParseForLoop.js';
import { testParseFunctionDefinition } from './testParseFunctionDefinition.js';
import { testParseIfStatement } from './testParseIfStatement.js';
import { testParseImport } from './testParseImport.js';
import { testParseIn } from './testParseIn.js';
import { testParseListLiteral } from './testParseListLiteral.js';
import { testParseLongStringLiteral } from './testParseLongStringLiteral.js';
import { testParsePrint } from './testParsePrint.js';
import { testParseSubscript } from './testParseSubscript.js';
import { testParseTry } from './testParseTry.js';
import { testParseTupleLiteral } from './testParseTupleLiteral.js';
import { testParseUnaryOperator } from './testParseUnaryOperator.js';
import { testParseWhileLoop } from './testParseWhileLoop.js';
import { testParseWith } from './testParseWith.js';
import { testParseWithoutException } from './testParseWithoutException.js';
import { testStringToParseTreeTokenType } from './testStringToParseTreeTokenType.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testCodeSanitizers,
		testParseBinaryOperator,
		testParseClass,
		testParseCommaExpression,
		testParseCurvedBracketExpression,
		testParseDecorator,
		testParseDictionaryLiteral,
		testParseDocstring,
		testParseDot,
		testParseExamples,
		testParseForLoop,
		testParseFunctionDefinition,
		testParseIfStatement,
		testParseImport,
		testParseIn,
		testParseListLiteral,
		testParseLongStringLiteral,
		testParsePrint,
		testParseSubscript,
		testParseTry,
		testParseTupleLiteral,
		testParseUnaryOperator,
		testParseWith,
		testParseWhileLoop,
		testParseWithoutException,
		testStringToParseTreeTokenType
	], logger);
};