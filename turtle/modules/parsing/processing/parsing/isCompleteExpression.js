import { expressionTokenTypes } from './expressionTokenTypes.js';
import { getExpectedChildrenLengthForToken } from './getExpectedChildrenLengthForToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isCompleteCodeBlock(token) {
	const children = token.children;
	const last = children[children.length - 1];
	if (last === undefined)
		return false;
	return last.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET;
}

const checkersMap = new Map([
	[ParseTreeTokenType.CODE_BLOCK, isCompleteCodeBlock]
]);

export function isCompleteExpression(token) {
	if (token === null)
		return false;
	const checker = checkersMap.get(token.type);
	if (checker !== undefined)
		return checker(token);
	const expectedChildCount = getExpectedChildrenLengthForToken(token);
	if (expectedChildCount !== undefined && expectedChildCount > token.children.length)
		return false;
	if (expressionTokenTypes.has(token.type)) {
		return true;
	}
	return false;
};