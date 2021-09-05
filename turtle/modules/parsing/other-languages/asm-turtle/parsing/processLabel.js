import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypesForAnchor = new Set([
	ParseTreeTokenType.INSTRUCTION_LIST,
	ParseTreeTokenType.PROC_START
]);

function isGoodLabelAnchorPrevious(token) {
	if (goodPreviousTypesForAnchor.has(token.type))
		return true;
	return false;
}

function isGoodLabelReferencePrevious(token) {
	if (token.type === ParseTreeTokenType.INSTRUCTION)
		return true;
	return false;
}

function getGoodPreviousToken(token, isGoodPrevious) {
	while (token.parentNode !== null && !isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

function shouldBeALabelAnchor(previous, next) {
	if (goodPreviousTypesForAnchor.has(previous.type))
		return true;
	if (next.val.startsWith('@@'))
		return true;
	return false;
}

export function processLabel(previousToken, nextToken) {
	if (shouldBeALabelAnchor(previousToken, nextToken)) {
		previousToken = getGoodPreviousToken(previousToken, isGoodLabelAnchorPrevious);
		nextToken.type = ParseTreeTokenType.LABEL_ANCHOR;
	}
	else
		previousToken = getGoodPreviousToken(previousToken, isGoodLabelReferencePrevious);

	previousToken.appendChild(nextToken);
	return nextToken;
};