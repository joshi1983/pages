import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processInstructionListIfNeeded } from './processInstructionListIfNeeded.js';

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type !== ParseTreeTokenType.REPEAT)
		return false;
	if (token.children.length !== 0 &&
	token.children[token.children.length - 1].type === ParseTreeTokenType.NEXT)
		return false;
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processNext(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	processInstructionListIfNeeded(previousToken, nextToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};