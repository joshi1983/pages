import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function forToInitToken(forToken) {
	const first = forToken.children[0];
	if (first === undefined || first.type !== ParseTreeTokenType.FOR_LOOP_SETTINGS)
		return null;

	const children = first.children;
	if (!children.some(t => t.type === ParseTreeTokenType.SEMICOLON))
		return null;

	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.SEMICOLON)
			return null;
		if (child.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
			return child;
	}
	return null;
};