import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CLASS_BODY,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.EXPORT,
	ParseTreeTokenType.FOR_LOOP_SETTINGS,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	if (token.type === ParseTreeTokenType.CODE_BLOCK &&
	token.children.length !== 0 &&
	token.children[0].type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
		return false;
	if (goodPreviousTypes.has(token.type))
		return true;
	if (token.type === ParseTreeTokenType.VAR && token.children.length === 0)
		return true;
	return false;
}

export function getGoodPreviousForDeclaration(previousToken) {
	while (!isGoodPrevious(previousToken))
		previousToken = previousToken.parentNode;
	return previousToken;
};