import { processToken } from '../processToken.js';

function getFinallyInstructionsToken(tryToken) {
	if (!tryToken.children.some(token => token.val === 'finally'))
		return; // no finally section.

	return tryToken.children[tryToken.children.length - 1];
}

function getHappyPathInstructionsToken(tryToken) {
	// [0] is the try keyword.
	// [1] is :.
	return tryToken.children[2];
}

export function processTryToken(token, result, cachedParseTree) {
	const happyInstructionsToken = getHappyPathInstructionsToken(token);
	const finallyInstructionsToken = getFinallyInstructionsToken(token);
	result.processCommentsUpToToken(token);
	processToken(happyInstructionsToken, result, cachedParseTree);
	if (finallyInstructionsToken !== undefined) {
		result.append('\n');
		processToken(finallyInstructionsToken, result, cachedParseTree);
	}
};