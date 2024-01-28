import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CLASS_BODY,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.FOR_LOOP_SETTINGS,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	if (goodPreviousTypes.has(token.type))
		return true;
	return false;
}

export function getGoodPreviousForDeclaration(previousToken) {
	while (!isGoodPrevious(previousToken))
		previousToken = previousToken.parentNode;
	return previousToken;
};