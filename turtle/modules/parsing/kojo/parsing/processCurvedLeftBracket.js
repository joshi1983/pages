import { isComplete } from
'./isCompleteWithNext.js';
import { isPossibleData } from
'./isPossibleData.js';
import { MaybeDecided } from
'../../../MaybeDecided.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const badFuncCallParentTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.DATA_TYPE_EXPRESSION,
	ParseTreeTokenType.VAL,
	ParseTreeTokenType.VAR
]);

function getGoodPrevious(token) {
	if (token.parentNode === null)
		return token;
	if (isComplete(token) === MaybeDecided.No)
		return token;

	let parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DEF)
		return parent;
	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY)
		return parent;
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	(parent.type === ParseTreeTokenType.CLASS ||
	parent.type === ParseTreeTokenType.DEF ||
	parent.type === ParseTreeTokenType.OBJECT)) {
		return parent;
	}

	return token;
}

function getGoodType(token) {
	if (token.type === ParseTreeTokenType.FOR)
		return ParseTreeTokenType.FOR_LOOP_SETTINGS;
	if (token.type === ParseTreeTokenType.ANNOTATION ||
	token.type === ParseTreeTokenType.CLASS ||
	token.type === ParseTreeTokenType.DEF ||
	token.type === ParseTreeTokenType.FUNC_CALL ||
	token.type === ParseTreeTokenType.OBJECT)
		return ParseTreeTokenType.ARG_LIST;
	if (token.type === ParseTreeTokenType.IMPORT)
		return ParseTreeTokenType.IMPORT_PACKAGE_LIST;
	
	return ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
}

function shouldCreateFuncCall(token) {
	if (token.type === ParseTreeTokenType.BOOLEAN_LITERAL ||
	token.type === ParseTreeTokenType.CHARACTER_LITERAL ||
	token.type === ParseTreeTokenType.CLASS ||
	token.type === ParseTreeTokenType.NUMBER_LITERAL ||
	token.type === ParseTreeTokenType.OBJECT ||
	token.type === ParseTreeTokenType.STRING_LITERAL ||
	token.type === ParseTreeTokenType.WHILE)
		return false;
	if (isComplete(token) === MaybeDecided.No)
		return false;
	if (token.type === ParseTreeTokenType.DEF) {
		const children = token.children;
		if (children.some(t => t.type === ParseTreeTokenType.CODE_BLOCK))
			return true;
	}
	if (isPossibleData(token)) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.BINARY_OPERATOR &&
		parent.children.length === 1)
			return false;
		return true;
	}
	return false;
}

function isLikelyMethodNeedingDataTypeConversion(token) {
	if (token.type !== ParseTreeTokenType.DEF)
		return false;
	const children = token.children;
	if (children.some(t => t.type === ParseTreeTokenType.CODE_BLOCK))
		return false;
	const firstChild = children[0];
	if (firstChild === undefined ||
	firstChild.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	return true;
}

function convertDataTypeExpressionForMethod(token) {
	const firstChild = token.children[0];
	if (firstChild.type === ParseTreeTokenType.ARG_LIST) {
		const dte = new ParseTreeToken(null, firstChild.lineIndex, firstChild.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		token.replaceChild(firstChild, dte);
		dte.appendChild(firstChild);
		firstChild.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
	}
}

function isGoodFuncCallParent(token, fCall) {
	if (token.parentNode === null)
		return true;

	const children = token.children;
	const lastChild = children[children.length - 1];
	if (lastChild !== fCall) {
		if (isComplete(token) === MaybeDecided.Yes) {
			return false;
		}
		if (token.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY)
			return false;
		if (token.type === ParseTreeTokenType.IDENTIFIER && children.length >= 1)
			return false;
	}
	return !badFuncCallParentTypes.has(token.type);
}

function getGoodFuncCallParent(token, fCall) {
	while (!isGoodFuncCallParent(token, fCall)) {
		token = token.parentNode;
	}
	return token;
}

function shouldCreateCodeBlockAbove(fCall) {
	const parent = fCall.parentNode;
	if (parent.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR ||
	parent.val !== '=')
		return false;
	const grandparent = parent.parentNode;
	if (grandparent.type !== ParseTreeTokenType.DEF)
		return false;
	return true;
}

export function processCurvedLeftBracket(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldCreateFuncCall(prev)) {
		const fCall = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.FUNC_CALL);
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, fCall);
		fCall.appendChild(prev);
		prev = fCall;
		const goodFuncCallParent = getGoodFuncCallParent(prevParent, fCall);
		if (goodFuncCallParent !== prevParent) {
			fCall.remove();
			goodFuncCallParent.appendChild(fCall);
		}
		if (shouldCreateCodeBlockAbove(fCall)) {
			const codeBlock = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.CODE_BLOCK);
			fCall.remove();
			codeBlock.appendChild(fCall);
			prevParent.appendChild(codeBlock);
		}
	}
	let type = getGoodType(prev);
	if (type === ParseTreeTokenType.ARG_LIST && isLikelyMethodNeedingDataTypeConversion(prev))
		convertDataTypeExpressionForMethod(prev);
	const curvedBracketExpression = new ParseTreeToken(null, next.lineIndex, next.colIndex, type);
	curvedBracketExpression.appendChild(next);
	prev.appendChild(curvedBracketExpression);
	return curvedBracketExpression;
};