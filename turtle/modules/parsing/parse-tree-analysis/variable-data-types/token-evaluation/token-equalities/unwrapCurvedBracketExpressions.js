import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function unwrapCurvedBracketExpressions(child) {
	while (child.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	child.children.length >= 2)
		child = child.children[1];
	return child;
};