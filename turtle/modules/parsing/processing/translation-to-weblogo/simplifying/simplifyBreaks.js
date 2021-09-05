import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function simplifyBreaks(root) {
	const breaks = getDescendentsOfType(root, ParseTreeTokenType.BREAK);
	for (const breakToken of breaks) {
		let next = breakToken.getNextSibling();
		if (next !== null && next.type === ParseTreeTokenType.SEMICOLON)
			next = next.getNextSibling();
		// remove some unreachable code after the break statement.
		while (next !== null && next.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET) {
			const nextNext = next.getNextSibling();
			next.remove();
			next = nextNext;
		} 
	}
};