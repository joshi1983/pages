import { convertArgListToExpression } from './convertArgListToExpression.js';
import { isArgListToConvertToExpression } from './isArgListToConvertToExpression.js';
import { isComplete } from './isComplete.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from
'../QBasicInternalFunctions.js';

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
	if (isArgListToAvoid(token))
		return false;

	return goodPreviousTypes.has(token.type);
}

function isGoodPreviousDown(token) {
	const children = token.children;
	if (children.length === 0)
		return true;
	return goodPreviousTypes.has(token.type);
}

function isArgListToAvoid(token) {
	const children = token.children;
	if (token.type === ParseTreeTokenType.ARG_LIST &&
	children.length !== 0) {
		const first = children[0];
		const last = children[children.length - 1];
		if (first.val === '(' && last.val !== ')')
			return false;
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.FUNCTION_CALL) {
			const nameToken = parent.children[0];
			if (nameToken.type === ParseTreeTokenType.IDENTIFIER &&
			QBasicInternalFunctions.getFunctionInfo(nameToken.val)) {
				return false;
			}
		}
		if (children.length === 1 &&
		first.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
			return true;
		}
		if (first.val === '(')
			return true;
	}
	return false;
}

function shouldAvoidPrevious(token) {
	if (token.type === ParseTreeTokenType.NUMBER_LITERAL ||
	token.type === token.type === ParseTreeTokenType.IDENTIFIER ||
	token.type === ParseTreeTokenType.STRING_LITERAL)
		return true;
	if (isArgListToAvoid(token))
		return true;

	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPreviousUp(token))
		token = token.parentNode;
	const topCandidate = token;
	while (!isGoodPreviousDown(token)) {
		const children = token.children;
		token = children[children.length - 1];
	}
	if (shouldAvoidPrevious(token)) {
		if (topCandidate.type === ParseTreeTokenType.TREE_ROOT)
			return topCandidate;
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
	return argList;
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
		return convertToFunctionCall(next);
	}
	return prev;
};