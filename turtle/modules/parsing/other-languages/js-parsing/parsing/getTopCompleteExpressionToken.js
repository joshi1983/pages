import { isCompleteExpression } from './isCompleteExpression.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isCompleteExpressionToken(token, notAboveTernary) {
	if (token === null)
		return false;
	if (notAboveTernary &&
	token.type === ParseTreeTokenType.CONDITIONAL_TERNARY) {
		return false;
	}
	if (token.parentNode !== null) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.CONDITIONAL_TERNARY) {
			if (token.type === ParseTreeTokenType.QUESTION_MARK ||
			token.type === ParseTreeTokenType.COLON)
				return true;
		}
	}
	if (isCompleteExpression(token))
		return true;
	return false;
}

export function getTopCompleteExpressionToken(token, notAboveTernary) {
	if (notAboveTernary === undefined)
		notAboveTernary = false;
	while (isCompleteExpressionToken(token.parentNode, notAboveTernary))
		token = token.parentNode;
	return token;
};