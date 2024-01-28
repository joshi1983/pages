import { addToken } from './addToken.js';
import { getGoodPreviousForDeclaration } from './getGoodPreviousForDeclaration.js';

export function processLet(previousToken, nextToken) {
	previousToken = getGoodPreviousForDeclaration(previousToken);
	addToken(previousToken, nextToken);
};