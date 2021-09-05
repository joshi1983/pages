import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getRemovableRootFor(token) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.DOT)
		return token;

	const grandParent = parent.parentNode;
	if (grandParent.type === ParseTreeTokenType.IDENTIFIER) {
		const tok = grandParent.parentNode;
		if (tok.type === ParseTreeTokenType.CODE_BLOCK || tok.type === ParseTreeTokenType.TREE_ROOT)
			return grandParent;
	}
}