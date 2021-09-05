import { createTokenFromToken } from './createTokenFromToken.js';
import { mightBeDataValueToken } from './mightBeDataValueToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const prevTypesNeedingExpressionDot = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.SUBSCRIPT_EXPRESSION
]);

function shouldCreateExpressionDot(prev) {
	if (prevTypesNeedingExpressionDot.has(prev.type))
		return true;
	return false;
}

function getGoodPrevious(prev) {
	let tok = prev;
	while (tok !== undefined && !mightBeDataValueToken(tok))
		tok = tok.children[tok.children.length - 1];

	if (tok !== undefined)
		return tok;

	return prev;
}

export function processDot(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldCreateExpressionDot(prev)) {
		const newToken = createTokenFromToken(null, next, ParseTreeTokenType.EXPRESSION_DOT);
		let newParent = prev;
		if (newParent.parentNode !== null) {
			newParent = newParent.parentNode;
			newParent.replaceChild(prev, newToken);
			prev.remove();
			newToken.appendChild(prev);
		}
		prev = newToken;
	}
	prev.appendChild(next);
	return next;
};