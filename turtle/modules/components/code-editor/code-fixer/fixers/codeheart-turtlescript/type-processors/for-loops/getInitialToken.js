import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';

export function getInitialToken(token) {
	if (token.children.length !== 0) {
		const settings = token.children[0];
		for (const child of settings.children) {
			if (child.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
				return child;
		}
	}
};