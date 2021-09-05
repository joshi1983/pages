import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.INSTRUCTION_LIST,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (token.parentNode !== null && !isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processProcStart(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};