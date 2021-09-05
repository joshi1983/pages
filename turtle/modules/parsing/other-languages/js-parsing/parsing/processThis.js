import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addToken } from './addToken.js';
import { getGoodPreviousForIdentifier } from './getGoodPreviousForIdentifier.js';

export function processThis(previousToken, nextToken) {
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		return nextToken;
	}
	previousToken = getGoodPreviousForIdentifier(previousToken);
	addToken(previousToken, nextToken);
};