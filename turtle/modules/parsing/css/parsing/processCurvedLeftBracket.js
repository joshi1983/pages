import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.AT_RULE,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.PSEUDO_CLASS
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.PSEUDO_CLASS) {
		return token.children.length === 0;
	}
	if (isCompleteValueToken(token) === false)
		return true;
	return goodPrevTypes.has(token.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

function shouldBeCurvedBracketExpression(prev) {
	if (prev.type === ParseTreeTokenType.IDENTIFIER ||
	prev.type === ParseTreeTokenType.PSEUDO_CLASS)
		return false;
	while (prev.parentNode !== null) {
		if (prev.type === ParseTreeTokenType.AT_RULE)
			return true;
		if (prev.type === ParseTreeTokenType.DECLARATION_BLOCK)
			return false;
		prev = prev.parentNode;
	}
	return false;
}

function shouldBecomeArgList(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return true;
	if (token.type === ParseTreeTokenType.PSEUDO_CLASS &&
	token.children.length === 0)
		return true;
	return false;
}

function createFunctionCallToken(prev, next) {
	if (prev.type !== ParseTreeTokenType.PSEUDO_CLASS)
		return new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.FUNCTION_CALL)
	return null;
}

export function processCurvedLeftBracket(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldBeCurvedBracketExpression(prev)) {
		const e = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
		e.appendChild(next);
		prev.appendChild(e);
		return e;
	}
	if (shouldBecomeArgList(prev)) {
		const argList = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.ARG_LIST);
		argList.appendChild(next);
		prev.appendChild(argList);
		const funcCall = createFunctionCallToken(prev, next);
		const prevParent = prev.parentNode;
		if (funcCall !== null) {
			prev.remove();
			funcCall.appendChild(prev);
			funcCall.appendChild(argList);
			prevParent.appendChild(funcCall);
		}
		return argList;
	}
	prev.appendChild(next);
	return next;
};