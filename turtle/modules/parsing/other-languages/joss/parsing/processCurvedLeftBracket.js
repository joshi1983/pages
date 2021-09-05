import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function shouldBecomeFunctionCall(prev) {
	if (prev.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return true;
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
		type = ParseTreeTokenType.ARG_LIST;
	}
	const curvedBracketExpression = new ParseTreeToken(null, next.lineIndex,
	next.colIndex, type);
	curvedBracketExpression.appendChild(next);
	prev.appendChild(curvedBracketExpression);
	return curvedBracketExpression;
};