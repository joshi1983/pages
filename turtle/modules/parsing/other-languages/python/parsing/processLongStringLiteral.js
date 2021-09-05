import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const docstringParentTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

function shouldBecomeDocstring(prev) {
	if (!docstringParentTypes.has(prev.type))
		return false;

	const children = prev.children;
	return children.length === 0;
}

export function processLongStringLiteral(prev, next) {
	if (shouldBecomeDocstring(prev)) {
		next.type = ParseTreeTokenType.DOCSTRING;
	}
	prev.appendChild(next);
	if (next.type === ParseTreeTokenType.DOCSTRING)
		return prev;
	else
		return next;
};