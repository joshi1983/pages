import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function copyToken(token) {
	const result = new ParseTreeToken(token.val, token.lineIndex, token.colIndex, token.type);
	for (const child of token.children) {
		const childCopy = copyToken(child);
		result.appendChild(childCopy);
	}
	
	return result;
}

function isOfInterest(token) {
	const name = token.val;
	if (name !== ':=' || token.children.length !== 2)
		return false;

	const firstChild = token.children[0];
	if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.CODE_BLOCK ||
	parent.type === ParseTreeTokenType.TREE_ROOT)
		return true;

	const grandParent = parent.parentNode;
	if (grandParent.type === ParseTreeTokenType.FUNCTION_CALL) {
		const fCallP = grandParent.parentNode;
		return fCallP.type === ParseTreeTokenType.CODE_BLOCK ||
			fCallP.type === ParseTreeTokenType.TREE_ROOT;
	}
	
	return false;
}

export function convertWalrusOperatorToAssignment(root) {
	const walrusTokens = getDescendentsOfType(root, ParseTreeTokenType.BINARY_OPERATOR).filter(isOfInterest);
	walrusTokens.forEach(function(walrusToken) {
		walrusToken.val = '=';
		walrusToken.type = ParseTreeTokenType.ASSIGNMENT_OPERATOR;
		const parent = walrusToken.parentNode;
		if ( parent.type !== ParseTreeTokenType.CODE_BLOCK &&
		parent.type !== ParseTreeTokenType.TREE_ROOT) {
			const firstChild = walrusToken.children[0];
			const copyOfFirstChild = copyToken(firstChild);
			walrusToken.appendSibling(copyOfFirstChild);
			const fCall = walrusToken.parentNode.parentNode;
			walrusToken.remove();
			const p = fCall.parentNode;
			p.insertChildBefore(p.children.indexOf(fCall), walrusToken);
		}
	});
	return walrusTokens.length !== 0;
};