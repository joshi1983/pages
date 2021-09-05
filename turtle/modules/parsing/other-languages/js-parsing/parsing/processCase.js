import { addToken } from './addToken.js';
import { findCaseOrDefaultFromToken } from './findCaseOrDefaultFromToken.js';

export function processCase(previousToken, nextToken) {
	let caseToken = findCaseOrDefaultFromToken(previousToken);
	if (caseToken !== null)
		caseToken.appendSibling(nextToken);
	else
		addToken(previousToken, nextToken);
};