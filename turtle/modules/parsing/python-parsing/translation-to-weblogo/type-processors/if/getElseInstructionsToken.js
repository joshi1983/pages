import { hasElseOrElif } from
'./hasElseOrElif.js';

export function getElseInstructionsToken(token) {
	if (hasElseOrElif(token)) {
		return token.children[token.children.length - 1];
	}
};