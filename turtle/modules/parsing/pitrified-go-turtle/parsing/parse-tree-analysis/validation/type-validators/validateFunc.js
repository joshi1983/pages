import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function validateFunc(token, parseLogger) {
	const children = token.children;
	const parent = token.parentNode;
	const lastChild = children[children.length - 1];
	if (lastChild !== undefined) {
		if (lastChild.type !== ParseTreeTokenType.CODE_BLOCK &&
		parent.type === ParseTreeTokenType.TREE_ROOT)
			parseLogger.error(`The last child of a FUNC should usually be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
	}
};