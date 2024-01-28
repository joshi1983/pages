import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addToken } from './addToken.js';

export function processBreak(previousToken, nextToken) {
	if (!addCodeBlockIfNeeded(previousToken, nextToken)) {
		addToken(previousToken, nextToken);
	}
};