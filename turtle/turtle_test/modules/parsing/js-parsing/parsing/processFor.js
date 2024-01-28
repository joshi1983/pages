import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addToken } from './addToken.js';

export function processFor(previousToken, nextToken) {
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		return nextToken;
	}
	addToken(previousToken, nextToken);
};