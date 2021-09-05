import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';

function isOfInterest(token) {
	// is this defining a function? Look for an ARG_LIST token.
	const children = token.children;
	if (children.length < 2)
		return false;
	const argList = children[1];
	if (argList.type !== ParseTreeTokenType.ARG_LIST)
		return false;

	return token.parentNode.type !== ParseTreeTokenType.TREE_ROOT;
}

export function defFunctionGlobalFixer(root) {
	const defs = getDescendentsOfType(root, ParseTreeTokenType.DEF).
		filter(isOfInterest);
	defs.forEach(function(def) {
		let rootChild = def.parentNode;
		while (rootChild.parentNode !== root) {
			rootChild = rootChild.parentNode;
		}
		let prev = def.getPreviousSibling();
		def.remove();
		rootChild.appendSibling(def);
		if (prev !== null && prev.type === ParseTreeTokenType.LABEL) {
			prev.remove();
			rootChild.appendSibling(prev);
		}
	});
	return defs.length !== 0;
};