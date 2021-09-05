import { ArrayUtils } from
'../../../../../ArrayUtils.js';

export function getElifInstructionsToken(token) {
	const index = ArrayUtils.indexOfMatch(token.children, (child) => child.val === 'elif');
	return token.children[index + 3];
	// index + 1 is index of the elif condition token
	// index + 2 is index of a colon(:).
};