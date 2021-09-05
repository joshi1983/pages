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
	if (prev.type === ParseTreeTokenType.TREE_ROOT ||
	prev.type === ParseTreeTokenType.CODE_BLOCK) {
		const lastChild = prev.children[prev.children.length - 1];
		if (lastChild === undefined)
			return false;
		return lastChild.type === ParseTreeTokenType.IDENTIFIER ||
			lastChild.type === ParseTreeTokenType.EXPRESSION_DOT;
	}
	if (prevTypesNeedingExpressionDot.has(prev.type))
		return true;
	return false;
}

function getGoodPrevious(prev) {
	if ((prev.type === ParseTreeTokenType.TREE_ROOT ||
	prev.type === ParseTreeTokenType.CODE_BLOCK) &&
	shouldCreateExpressionDot(prev))
		return prev;

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
		if (newParent.parentNode !== null &&
		newParent.type !== ParseTreeTokenType.CODE_BLOCK) {
			newParent = newParent.parentNode;
			newParent.replaceChild(prev, newToken);
			prev.remove();
			newToken.appendChild(prev);
		}
		else {
			const lastChild = newParent.children[newParent.children.length - 1];
			lastChild.remove();
			newToken.appendChild(lastChild);
			newParent.appendChild(newToken);
		}
		prev = newToken;
	}
	prev.appendChild(next);
	return next;
};