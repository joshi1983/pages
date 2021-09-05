import { CommentDumpingStringBuffer } from
'../../../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { noop } from
'../../../../../../noop.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processAssignmentOperator } from
'./processAssignmentOperator.js';
import { processBinaryOperator } from
'./processBinaryOperator.js';
import { processEnd } from
'./processEnd.js';
import { processFunction } from
'./processFunction.js';
import { processFunctionCall } from
'./processFunctionCall.js';
import { processIdentifier } from
'./processIdentifier.js';
import { processNumberLiteral } from
'./processNumberLiteral.js';
import { processResult } from
'./processResult.js';
import { processStringLiteral } from
'./processStringLiteral.js';
import { processVar } from
'./processVar.js';
import { processTokens } from './helpers/processTokens.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.COMMA, noop],
	[ParseTreeTokenType.COLON, noop],
	[ParseTreeTokenType.CONST, processVar],
	[ParseTreeTokenType.DATA_TYPE_EXPRESSION, noop],
	[ParseTreeTokenType.END_FUNCTION, processEnd],
	[ParseTreeTokenType.END_PROCEDURE, processEnd],
	[ParseTreeTokenType.EXPORT, noop],
	[ParseTreeTokenType.FUNCTION, processFunction],
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PROCEDURE, processFunction],
	[ParseTreeTokenType.RESULT, processResult],
	[ParseTreeTokenType.SEMICOLON, noop],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
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