import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isFunctionDefinitionName } from
'./isFunctionDefinitionName.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function isClassName(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.CLASS)
		return parent.children[0] === token;
	return false;
}

function isVariableDeclaration(token) {
	let parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.children[0] === token)
		parent = parent.parentNode;
	if (parent.type === ParseTreeTokenType.VAR ||
	parent.type === ParseTreeTokenType.VAL)
		return true;
	return false;
}

function isFormalParameter(token) {
	if (token.children === 0)
		return false; // data types are always specified for formal parameters.
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	let grandparent = parent.parentNode;
	if (grandparent.type === ParseTreeTokenType.DEF)
		return true;
	return false;
}

function isOfInterest(token) {
	return isClassName(token) ||
		isFunctionDefinitionName(token) ||
		isVariableDeclaration(token) ||
		isFormalParameter(token);
}

export function getIdentifiersInfo(root) {
	const identifiers = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).
		filter(isOfInterest);
	const result = new Map();
	for (const identifierToken of identifiers) {
		let info = result.get(identifierToken.val);
		if (info === undefined) {
			info = {'declarations': [identifierToken]};
			result.set(identifierToken.val, info);
		}
		else
			info.declarations.push(identifierToken);
	}
	return result;
};