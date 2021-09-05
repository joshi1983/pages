import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export function getFirstIdentifier(expression) {
	const children = expression.children;
	for (const child of expression.children) {
		if (child.type === ParseTreeTokenType.COMMA)
			return;
		if (child.type === ParseTreeTokenType.IDENTIFIER)
			return child.val;
	}
};