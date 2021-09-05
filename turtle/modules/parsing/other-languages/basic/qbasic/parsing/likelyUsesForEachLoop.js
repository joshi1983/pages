import { isComment } from '../scanning/isComment.js';
import { isIdentifier } from '../scanning/isIdentifier.js';

function getNextNonComment(scanTokens, startIndex) {
	for (;startIndex < scanTokens.length; startIndex++) {
		const tok = scanTokens[startIndex];
		if (!isComment(tok.s))
			return startIndex;
	}
}

export function likelyUsesForEachLoop(scanTokens) {
	let forEachFound = false;
	let inFound = false;
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		const sLower = tok.s.toLowerCase();
		if (sLower === 'for') {
			const nextNonCommentIndex = getNextNonComment(scanTokens, i + 1);
			if (nextNonCommentIndex !== undefined &&
			scanTokens[nextNonCommentIndex].s.toLowerCase() === 'each') {
				const identifierIndex = getNextNonComment(scanTokens, nextNonCommentIndex + 1);
				if (identifierIndex !== undefined &&
				isIdentifier(scanTokens[identifierIndex].s))
					forEachFound = true;
			}
		}
		else if (sLower === 'in' && forEachFound)
			inFound = true;
		else if (sLower === 'next' && inFound)
			return true;
	}
	return false;
};