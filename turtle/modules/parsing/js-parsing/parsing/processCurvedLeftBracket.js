import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithSquareRightBracket } from './endsWithSquareRightBracket.js';
import { isCompleteArrowFunctionExpression } from './isCompleteArrowFunctionExpression.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldAppendChild } from './shouldAppendChild.js';

const argListPreviousTypes = new Set([
	ParseTreeTokenType.CATCH,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.INDEX_EXPRESSION,
	ParseTreeTokenType.REGULAR_EXPRESSION_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL
]);
const functionCallTokenTypes = new Set([
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.INDEX_EXPRESSION,
	ParseTreeTokenType.REGULAR_EXPRESSION_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL,
	ParseTreeTokenType.THIS
]);
const nonFunctionCallParentTypes = new Set([
	ParseTreeTokenType.ASYNC,
	ParseTreeTokenType.CLASS_BODY,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.STATIC,
]);
const prevWithCodeBlockParentTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.IF
]);

function addNext(previousToken, nextToken) {
	if (shouldAppendChild(previousToken, nextToken))
		previousToken.appendChild(nextToken);
	else
		previousToken.appendSibling(nextToken);
}

function setCodeBlockParentIfNeeded(previousToken) {
	if (shouldMakeArgList(previousToken)) {
		if (isForFunctionCall(previousToken)) {
			previousToken = getFunctionCallRootToken(previousToken);
		}
	}
	const parent = previousToken.parentNode;
	if (parent === null ||
	parent.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return;
	if (prevWithCodeBlockParentTypes.has(previousToken.type))
		parent.type = ParseTreeTokenType.CODE_BLOCK;
}

function shouldMakeArgList(previousToken) {
	if (isCompleteArrowFunctionExpression(previousToken))
		return true;
	return argListPreviousTypes.has(previousToken.type);
}

function isForFunctionImplementation(previousToken) {
	return previousToken.parentNode.type === ParseTreeTokenType.FUNCTION;
}

function canBeFunctionCallRootToken(token) {
	if (token.parentNode === null)
		return true;
	if (token.parentNode.type === ParseTreeTokenType.INDEX_EXPRESSION) {
		return !endsWithSquareRightBracket(token.parentNode);
	}
	return !functionCallTokenTypes.has(token.parentNode.type);
}

function getFunctionCallRootToken(token) {
	while (!canBeFunctionCallRootToken(token))
		token = token.parentNode;
	return token;
}

function isForFunctionCall(token) {
	if (isCompleteArrowFunctionExpression(token))
		return true;
	if (!functionCallTokenTypes.has(token.type))
		return false;
	const root = getFunctionCallRootToken(token);
	const rootParent = root.parentNode;
	if (rootParent === null)
		return false;
	if (nonFunctionCallParentTypes.has(rootParent.type))
		return false;
	return true;
}

function isGoodPrevious(token) {
	if (token.type === ParseTreeTokenType.ARG_LIST && endsWithClosingCurvedBracket(token))
		return false;
	if (token.type === ParseTreeTokenType.IDENTIFIER && token.children.length >= 1)
		return false;
	if (token.type === ParseTreeTokenType.DOT && token.children.length >= 1)
		return false;
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processCurvedLeftBracket(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	setCodeBlockParentIfNeeded(previousToken);
	if (shouldMakeArgList(previousToken)) {
		const argListToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.ARG_LIST);
		argListToken.appendChild(nextToken);
		if (isForFunctionCall(previousToken)) {
			previousToken = getFunctionCallRootToken(previousToken);
			const funcCallParent = previousToken.parentNode;
			const funcCallToken = new ParseTreeToken(null, previousToken.lineIndex, previousToken.colIndex, ParseTreeTokenType.FUNCTION_CALL);
			previousToken.remove();
			funcCallToken.appendChild(previousToken);
			funcCallToken.appendChild(argListToken);
			funcCallParent.appendChild(funcCallToken);
		}
		else {
			if (isForFunctionImplementation(previousToken))
				previousToken.appendSibling(argListToken);
			else
				previousToken.appendChild(argListToken);
		}
	}
	else if (previousToken.type === ParseTreeTokenType.FOR) {
		const forLoopSettings = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.FOR_LOOP_SETTINGS);
		forLoopSettings.appendChild(nextToken);
		previousToken.appendChild(forLoopSettings);
	}
	else {
		const exprToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
		exprToken.appendChild(nextToken);
		addNext(previousToken, exprToken);
	}
};