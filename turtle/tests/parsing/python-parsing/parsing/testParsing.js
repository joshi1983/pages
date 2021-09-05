import { testParseBinaryOperator } from './testParseBinaryOperator.js';
import { testParseClass } from './testParseClass.js';
import { testParseDot } from './testParseDot.js';
import { testParseExamples } from './testParseExamples.js';
import { testParseForLoop } from './testParseForLoop.js';
import { testParseFunctionDefinition } from './testParseFunctionDefinition.js';
import { testParseIfStatement } from './testParseIfStatement.js';
import { testParseImport } from './testParseImport.js';
import { testParseListLiteral } from './testParseListLiteral.js';
import { testParsePrint } from './testParsePrint.js';
import { testParseTry } from './testParseTry.js';
import { testParseTupleLiteral } from './testParseTupleLiteral.js';
import { testParseWhileLoop } from './testParseWhileLoop.js';
import { testStringToParseTreeTokenType } from './testStringToParseTreeTokenType.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testParseBinaryOperator,
		testParseClass,
		testParseDot,
		testParseExamples,
		testParseForLoop,
		testParseFunctionDefinition,
		testParseIfStatement,
		testParseImport,
		testParseListLiteral,
		testParsePrint,
		testParseTry,
		testParseTupleLiteral,
		testParseWhileLoop,
		testStringToParseTreeTokenType
	], logger);
};