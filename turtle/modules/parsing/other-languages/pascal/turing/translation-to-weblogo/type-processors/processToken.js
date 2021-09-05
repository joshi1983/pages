import { CommentDumpingStringBuffer } from
'../../../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { noop } from
'../../../../../../noop.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processAssert } from
'./processAssert.js';
import { processAssignmentOperator } from
'./processAssignmentOperator.js';
import { processBinaryOperator } from
'./processBinaryOperator.js';
import { processBooleanLiteral } from
'./processBooleanLiteral.js';
import { processEnd } from
'./processEnd.js';
import { processExit } from
'./processExit.js';
import { processFor } from
'./processFor.js';
import { processFunction } from
'./processFunction.js';
import { processFunctionCall } from
'./processFunctionCall.js';
import { processIdentifier } from
'./processIdentifier.js';
import { processIf } from
'./processIf.js';
import { processLoop } from
'./processLoop.js';
import { processModule } from
'./processModule.js';
import { processNumberLiteral } from
'./processNumberLiteral.js';
import { processResult } from
'./processResult.js';
import { processReturn } from
'./processReturn.js';
import { processStringLiteral } from
'./processStringLiteral.js';
import { processUnaryOperator } from
'./processUnaryOperator.js';
import { processVar } from
'./processVar.js';
import { processTokens } from './helpers/processTokens.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ASSERT, processAssert],
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.BOOLEAN_LITERAL, processBooleanLiteral],
	[ParseTreeTokenType.COMMA, noop],
	[ParseTreeTokenType.COLON, noop],
	[ParseTreeTokenType.CONST, processVar],
	[ParseTreeTokenType.DATA_TYPE_EXPRESSION, noop],
	[ParseTreeTokenType.END_FUNCTION, processEnd],
	[ParseTreeTokenType.END_LOOP, noop],
	[ParseTreeTokenType.END_MODULE, noop],
	[ParseTreeTokenType.END_PROCEDURE, processEnd],
	[ParseTreeTokenType.END_RECORD, noop],
	[ParseTreeTokenType.EXIT, processExit],
	[ParseTreeTokenType.EXPORT, noop],
	[ParseTreeTokenType.EXTERNAL, noop],
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.FUNCTION, processFunction],
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.IMPLEMENT, noop],
	[ParseTreeTokenType.LOOP, processLoop],
	[ParseTreeTokenType.MODULE, processModule],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PROCEDURE, processFunction],
	[ParseTreeTokenType.RECORD, noop],
	[ParseTreeTokenType.RESULT, processResult],
	[ParseTreeTokenType.RETURN, processReturn],
	[ParseTreeTokenType.SEMICOLON, noop],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.TYPE, noop],
	[ParseTreeTokenType.UNARY_OPERATOR, processUnaryOperator],
	[ParseTreeTokenType.VAR, processVar]
]);

export function processToken(token, result) {
	if (!(result instanceof CommentDumpingStringBuffer))
		throw new Error(`result must be a CommentDumpingStringBuffer.  Not: ${result}`);

	const processor = typeProcessors.get(token.type);
	if (processor !== undefined)
		processor(token, result);
	else
		processTokens(token.children, result);
};