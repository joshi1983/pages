import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getTreeRoot } from
'../../../../../generic-parsing-utilities/getTreeRoot.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const declaringParentTypes = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.STATIC,
	ParseTreeTokenType.VAR
]);
const nonDeclaringParentTypes = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.UNARY_OPERATOR
]);

function identifierToDeclarationToken(identifierToken) {
	const parent = identifierToken.parentNode;
	if (declaringParentTypes.has(parent.type))
		return parent;
	const grandParent = parent.parentNode;
	if (declaringParentTypes.has(grandParent.type))
		return grandParent;
	return parent;
}

function isBeingDeclared(identifierToken) {
	const parent = identifierToken.parentNode;
	if (declaringParentTypes.has(parent.type))
		return true;
	if (nonDeclaringParentTypes.has(parent.type))
		return false;
	const grandParent = parent.parentNode;
	if (parent.type === ParseTreeTokenType.BINARY_OPERATOR &&
	parent.val === '=>') {
		if (parent.children.indexOf(identifierToken) === 0)
			return true;
	}
	else if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		if (parent.val === '=') {
			if (declaringParentTypes.has(grandParent.type))
				return true;
		}
	}
	else if (parent.type === ParseTreeTokenType.ARG_LIST) {
		if (grandParent.type === ParseTreeTokenType.FUNCTION ||
		grandParent.type === ParseTreeTokenType.IDENTIFIER)
			return true;
		else if (grandParent.type === ParseTreeTokenType.BINARY_OPERATOR &&
		grandParent.val === '=>') {
			return true;
		}
	}
	return false;
}

export function getDeclarationsFor(identifierToken) {
	const name = identifierToken.val;
	const root = getTreeRoot(identifierToken);
	const matches = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).
		filter(t => t.val === name && isBeingDeclared(t));
	const declarations = matches.map(identifierToDeclarationToken);
	return declarations;
};