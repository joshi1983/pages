import { getClosestOfTypes } from
'../../../../generic-parsing-utilities/getClosestOfTypes.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function getScopeContainer(declaration) {
	const a = getClosestOfTypes(declaration.parentNode, [
		ParseTreeTokenType.ARG_LIST,
		ParseTreeTokenType.CODE_BLOCK,
		ParseTreeTokenType.TREE_ROOT
	]);
	if (a.type === ParseTreeTokenType.ARG_LIST) {
		const p = a.parentNode;
		if (p.type === ParseTreeTokenType.FUNC) {
			const codeBlock = p.children[p.children.length - 1];
			if (codeBlock.type === ParseTreeTokenType.CODE_BLOCK)
				return codeBlock;
		}
	}
	return a;
}

export function isInScope(declaration, token) {
	const container = getScopeContainer(declaration);
	return container === token;
};