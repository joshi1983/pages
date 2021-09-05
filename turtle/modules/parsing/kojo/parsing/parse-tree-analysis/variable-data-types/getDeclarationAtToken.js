import { getDepth } from
'../../../../generic-parsing-utilities/getDepth.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function getScopeContainerFor(token) {
	while (token !== null) {
		if (token.type === ParseTreeTokenType.CODE_BLOCK ||
			token.type === ParseTreeTokenType.TREE_ROOT)
			return token;
		token = token.parentNode;
	}
}

function getDeepest(tokens) {
	let result;
	let maxDepth;

	for (const token of tokens) {
		const depth = getDepth(token);
		if (maxDepth === undefined || maxDepth < depth) {
			result = token;
			maxDepth = depth;
		}
	}
	return result;
}

export function getDeclarationAtToken(token, declarations) {
	if (!(declarations instanceof Array))
		throw new Error(`declarations must be an Array but declarations=${declarations}`);
	
	const codeBlocks = [];
	let treeRoot;
	let tok = token;
	while (tok !== null) {
		if (tok.type === ParseTreeTokenType.CODE_BLOCK)
			codeBlocks.push(tok);
		if (tok.type === ParseTreeTokenType.TREE_ROOT)
			treeRoot = tok;
		tok = tok.parentNode;
	}
	const connectedAncestors = new Set(codeBlocks);
	connectedAncestors.add(treeRoot);
	declarations = declarations.filter(d => connectedAncestors.has(getScopeContainerFor(d)));
	return getDeepest(declarations);
};