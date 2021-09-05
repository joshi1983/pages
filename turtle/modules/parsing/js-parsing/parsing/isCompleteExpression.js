import { expressionTokenTypes } from './expressionTokenTypes.js';
import { getExpectedChildrenLengthForToken } from './getExpectedChildrenLengthForToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isCompleteExpression(token) {
	if (token === null)
		return false;
	const expectedChildCount = getExpectedChildrenLengthForToken(token);
	if (expectedChildCount !== undefined && expectedChildCount > token.children.length)
		return false;
	if (expressionTokenTypes.has(token.type)) {
		return true;
	}
	return false;
};