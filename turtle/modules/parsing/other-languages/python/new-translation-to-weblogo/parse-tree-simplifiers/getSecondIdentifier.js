import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export function getSecondIdentifier(expression) {
	const children = expression.children;
	let commaFound = false;
	for (const child of expression.children) {
		if (child.type === ParseTreeTokenType.COMMA) {
			if (commaFound)
				return; // indicate not found.

			commaFound = true;
		}
		else if (child.type === ParseTreeTokenType.IDENTIFIER &&
		commaFound === true)
			return child.val;
	}
};