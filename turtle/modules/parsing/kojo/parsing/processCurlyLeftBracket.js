import { getSortedLastDescendentTokenOf } from
'../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { isComplete, isCompleteWithNext } from
'./isCompleteWithNext.js';
import { isPossibleData } from
'./isPossibleData.js';
import { MaybeDecided } from
'../../../MaybeDecided.js';
import { MigrationInfo } from
'../MigrationInfo.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { SetUtils } from
'../../../SetUtils.js';

const codeBlockParentTypes = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.IF
]);

const goodTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.MATCH
]);

SetUtils.addAll(goodTypes, codeBlockParentTypes);

function isGoodPrevious(prev, next) {
	const parent = prev.parentNode;
	if (parent === null)
		return true;

	if (isComplete(prev) === MaybeDecided.No)
		return true;

	if (isCompleteWithNext(prev, next))
		return false;

	const children = prev.children;
	if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return false;
	if (prev.type === ParseTreeTokenType.FUNC_CALL &&
	children.length === 2) {
		return true;
	}
	if (shouldCreateFuncCall(prev))
		return true;
	return goodTypes.has(prev.type);
}

function getGoodPrevious(prev, next) {
	while (!isGoodPrevious(prev, next))
		prev = prev.parentNode;
	return prev;
}

function getTypeFor(prev) {
	return ParseTreeTokenType.CODE_BLOCK;
}

function shouldCreateDataTypeExpression(prev) {
	if (prev.parentNode === null)
		return false;
	if (goodTypes.has(prev.type))
		return false;
	if (isPossibleData(prev))
		return false;
	return true;
}

function shouldConvertToDataTypeExpression(prev) {
	if (prev.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;
	const children = prev.children;
	if (children.length < 2)
		return false;
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.COLON)
		return false;
	const parent = prev.parentNode;
	if (parent.type !== ParseTreeTokenType.DEF)
		return false;
	return true;
}

function shouldCreateFuncCall(prev) {
	if (prev.type === ParseTreeTokenType.FUNC_CALL)
		return false;
	const info = MigrationInfo.getFunctionInfo(prev);
	if (info !== undefined && info.expectsCodeBlock)
		return true;
	return false;
}

export function processCurlyLeftBracket(prev, next) {
	prev = getGoodPrevious(prev, next);
	if (shouldCreateFuncCall(prev)) {
		const prevParent = prev.parentNode;
		const funcCall = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.FUNC_CALL);
		prevParent.replaceChild(prev, funcCall);
		funcCall.appendChild(prev);
		const prevLastPosition = getSortedLastDescendentTokenOf(prev);
		const argList = new ParseTreeToken(null, prevLastPosition.lineIndex, prevLastPosition.colIndex, ParseTreeTokenType.ARG_LIST);
		funcCall.appendChild(argList);
		prev = funcCall;
	}
	let isCodeBlockNeeded = false;
	if (shouldConvertToDataTypeExpression(prev)) {
		const colon = prev.children[0];
		prev.type = ParseTreeTokenType.DATA_TYPE_EXPRESSION;
		colon.remove();
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, colon);
		colon.appendChild(prev);
		prev = prevParent;
		isCodeBlockNeeded = true;
	}
	else if (shouldCreateDataTypeExpression(prev)) {
		const dtExpression = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, dtExpression);
		dtExpression.appendChild(prev);
		prev = dtExpression;
	}
	if (goodTypes.has(prev.type) && !isCodeBlockNeeded) {
		prev.appendChild(next);
		return prev;
	}
	const type = getTypeFor(prev);
	const curlyBracketExpression = new ParseTreeToken(null, next.lineIndex, next.colIndex, type);
	curlyBracketExpression.appendChild(next);
	prev.appendChild(curlyBracketExpression);
	return curlyBracketExpression;
};