import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.INSTRUCTION_LIST,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	if (token.children.length !== 0 &&
	token.children[token.children.length - 1].type === ParseTreeTokenType.INSTRUCTION)
		return true;
	if (goodPreviousTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (token.parentNode !== null && !isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processInstruction(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};