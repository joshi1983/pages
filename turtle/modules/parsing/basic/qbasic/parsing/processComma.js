import { convertArgListToExpression } from './convertArgListToExpression.js';
import { isArgListToConvertToExpression } from './isArgListToConvertToExpression.js';
import { isComplete } from './isComplete.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 
	// only because it could become a TUPLE_LITERAL later in the parsing process.

	ParseTreeTokenType.DEF_PRIMITIVE,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.SHARED,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.TYPE
]);

const parentTypesNotForNewArgumentList = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.COMMON,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.SHARED,
	ParseTreeTokenType.SUB,
	ParseTreeTokenType.TYPE
]);

function shouldPreviousBecomeTupleLiteral(token) {
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return true;
	return false;
}

function isGoodPreviousUp(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.TUPLE_LITERAL ||
	token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		return !isComplete(token);
	}
	return goodPreviousTypes.has(token.type);
}

function isGoodPreviousDown(token) {
	const children = token.children;
	if (children.length === 0)
		return true;
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPreviousUp(token))
		token = token.parentNode;
	while (!isGoodPreviousDown(token)) {
		const children = token.children;
		token = children[children.length - 1];
	}
	return token;
}

function shouldCreateFunctionCallAndArgList(commaToken) {
	const parent = commaToken.parentNode;
	if (parentTypesNotForNewArgumentList.has(parent.type))
		return false;

	const firstArg = commaToken.getPreviousSibling();
	if (firstArg === null)
		return false;

	const nameToken = firstArg.getPreviousSibling();
	if (nameToken === null || nameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	return true;
}

function convertToFunctionCall(commaToken) {
	const parent = commaToken.parentNode;
	const firstArg = commaToken.getPreviousSibling();
	const nameToken = firstArg.getPreviousSibling();
	const functionCall = new ParseTreeToken(null, firstArg.lineIndex, firstArg.colIndex, ParseTreeTokenType.FUNCTION_CALL);
	const argList = new ParseTreeToken(null, firstArg.lineIndex, firstArg.colIndex, ParseTreeTokenType.ARG_LIST);
	nameToken.remove();
	functionCall.appendChild(nameToken);
	firstArg.remove();
	argList.appendChild(firstArg);
	commaToken.remove();
	argList.appendChild(commaToken);
	functionCall.appendChild(argList);
	parent.appendChild(functionCall);
}

export function processComma(prev, next) {
	prev = getGoodPrevious(prev);
	if (isArgListToConvertToExpression(prev))
		convertArgListToExpression(prev);
	else if (shouldPreviousBecomeTupleLiteral(prev))
		prev.type = ParseTreeTokenType.TUPLE_LITERAL;
	if (prev.type === ParseTreeTokenType.IDENTIFIER)
		prev.appendSibling(next);
	else
		prev.appendChild(next);
	if (shouldCreateFunctionCallAndArgList(next)) {
		convertToFunctionCall(next);
	}
	return prev;
};