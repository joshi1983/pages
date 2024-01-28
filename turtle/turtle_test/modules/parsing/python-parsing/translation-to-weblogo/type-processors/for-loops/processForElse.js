import { processToken } from '../../processToken.js';

export function processForElse(forToken, result, cachedParseTree) {
	if (forToken.children.length !== 8)
		return; // nothing to do.
	const elseInstructionsToken = forToken.children[7];
	processToken(elseInstructionsToken, result, cachedParseTree);
};