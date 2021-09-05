import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function forToConditionToken(forToken) {
	const first = forToken.children[0];
	if (first === undefined || first.type !== ParseTreeTokenType.FOR_LOOP_SETTINGS)
		return null;

	const children = first.children;
	let semicolonFound = false;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.SEMICOLON)
			semicolonFound = true;
		else if (semicolonFound) {
			if (child.type === ParseTreeTokenType.SEMICOLON ||
			child.type === ParseTreeTokenType.COMMA ||
			child.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
				return null;
			return child;
		}
	}
	return null;
};