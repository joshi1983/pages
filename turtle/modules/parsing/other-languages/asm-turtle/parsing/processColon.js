import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const anchorPreviousTypes = new Set([
	ParseTreeTokenType.INSTRUCTION,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.VARIABLE_REFERENCE
]);

export function processColon(previousToken, nextToken) {
	if (previousToken.children.length === 0 &&
	anchorPreviousTypes.has(previousToken.type))
		previousToken.type = ParseTreeTokenType.LABEL_ANCHOR;
	previousToken.appendChild(nextToken);
	return nextToken;
};