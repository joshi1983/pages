import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function shouldBecomeFunctionCall(prev) {
	if (prev.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return true;
}

function shouldCreateCurvedBracketExpression(prev) {
	if (prev.type === ParseTreeTokenType.ARG_LIST &&
	prev.children.length === 0)
		return false;

	return true;
}

function createNewToken(prev, next, type) {
	const newToken = new ParseTreeToken(null, next.lineIndex,
	next.colIndex, type);
	newToken.appendChild(next);
	prev.appendChild(newToken);
	return newToken;
}

export function processCurvedLeftBracket(prev, next) {
	let type = ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
	if (shouldBecomeFunctionCall(prev)) {
		const functionCall = new ParseTreeToken(null, prev.lineIndex,
		prev.colIndex, ParseTreeTokenType.FUNCTION_CALL);
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, functionCall);
		const identifier = prev;
		prev = functionCall;
		functionCall.appendChild(identifier);
		return createNewToken(prev, next, ParseTreeTokenType.ARG_LIST);
	}
	if (shouldCreateCurvedBracketExpression(prev)) {
		return createNewToken(prev, next, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
	}
	prev.appendChild(next);
	return prev;
};