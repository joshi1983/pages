import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function forToStepToken(forToken) {
	const first = forToken.children[0];
	if (first === undefined || first.type !== ParseTreeTokenType.FOR_LOOP_SETTINGS)
		return null;

	if (first.children.filter(t => t.type === ParseTreeTokenType.SEMICOLON).length !== 2)
		return null;

	for (let i = first.children.length - 1; i > 2; i--) {
		const child = first.children[i];
		if (child.type === ParseTreeTokenType.SEMICOLON)
			return null;
		if (child.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
			return child;
		}
	}
	return null;
};