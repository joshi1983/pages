import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const squareBracketTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.INDEX_EXPRESSION,
]);

export function isCompleteSquareBracketExpression(token) {
	if (!squareBracketTypes.has(token.type) ||
	token.children.length < 2)
		return false;
	const children = token.children;
	if (children[0].type !== ParseTreeTokenType.SQUARE_LEFT_BRACKET)
		return false;
	if (children[children.length - 1].type !== ParseTreeTokenType.SQUARE_RIGHT_BRACKET)
		return false;
	return true;
}