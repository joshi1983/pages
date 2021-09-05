import { isCompleteWithNext } from
'./isCompleteWithNext.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodTypes = new Set([
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNC,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.SWITCH,
	ParseTreeTokenType.WHILE,
]);

function isGoodPrevious(prev, next) {
	if (prev.parentNode === null)
		return true;
	if (isCompleteWithNext(prev, next))
		return false;

	return goodTypes.has(prev.type);
}

function getGoodPrevious(prev, next) {
	while (!isGoodPrevious(prev, next))
		prev = prev.parentNode;
	return prev;
}

function getTypeFor(prev) {
	if (prev.type === ParseTreeTokenType.SWITCH)
		return ParseTreeTokenType.SWITCH_BODY;
	if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return ParseTreeTokenType.COMPOSITE_LITERAL_VALUE;

	return ParseTreeTokenType.CODE_BLOCK;
}

function shouldCreateDataTypeExpression(prev) {
	if (prev.parentNode === null)
		return false;
	if (goodTypes.has(prev.type))
		return false;
	if (prev.type === ParseTreeTokenType.RANGE)
		return false;
	return true;
}

export function processCurlyLeftBracket(prev, next) {
	prev = getGoodPrevious(prev, next);
	if (shouldCreateDataTypeExpression(prev)) {
		const dtExpression = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, dtExpression);
		dtExpression.appendChild(prev);
		prev = dtExpression;
	}
	const type = getTypeFor(prev);
	const curlyBracketExpression = new ParseTreeToken(null, next.lineIndex, next.colIndex, type);
	curlyBracketExpression.appendChild(next);
	prev.appendChild(curlyBracketExpression);
	return curlyBracketExpression;
};