import { processToken } from '../processToken.js';

export function processForElse(forToken, result, cachedParseTree) {
	if (forToken.children.length !== 6)
		return; // nothing to do.
	const elseToken = forToken.children[5];
	if (elseToken.children.length === 2) {
		const elseInstructionsToken = elseToken.children[1];
		processToken(elseInstructionsToken, result, cachedParseTree);
	}
};