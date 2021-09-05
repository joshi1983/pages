import { hasElseOrElif } from
'./hasElseOrElif.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getElseInstructionsToken(token) {
	if (hasElseOrElif(token)) {
		const elseToken = token.children[token.children.length - 1];
		if (elseToken.type !== ParseTreeTokenType.ELSE)
			return;
		return elseToken.children[1];
	}
};