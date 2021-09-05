import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processInstructionListIfNeeded } from './processInstructionListIfNeeded.js';

const prevTypes = new Set([
	ParseTreeTokenType.IF,
]);

function getGoodPrevious(token) {
	while (token.parentNode !== null && !prevTypes.has(token.type))
		token = token.parentNode;
	return token;
}

export function processEndIf(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	processInstructionListIfNeeded(previousToken, nextToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};