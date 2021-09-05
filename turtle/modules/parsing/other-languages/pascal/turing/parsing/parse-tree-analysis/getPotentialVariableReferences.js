import { getClosestOfTypes } from
'../../../../../generic-parsing-utilities/getClosestOfTypes.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function mightBeVariableRead(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER ||
	token.children.length !== 0)
		return false;

	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY) {
		// for example, p.y

		if (parent.children[0] !== token)
			return false;
			// y in p.y is not a variable named y being read.
		
	}
	else if (parent.type === ParseTreeTokenType.COMMA_LIST ||
	parent.type === ParseTreeTokenType.VAR ||
	parent.type === ParseTreeTokenType.CONST)
		return false;

	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.val === ':=' &&
	parent.children[0] === token)
		return false; // for example, x := 3
			// That x is not being read.

	return true;
}

function pushCandidates(token, results, variableName) {
	if (mightBeVariableRead(token) &&
	token.val.toLowerCase() === variableName) {
		results.push(token);
	}
	for (const child of token.children) {
		pushCandidates(child, results, variableName);
	}
}

export function getPotentialVariableReferences(token, variableName) {
	const container = getClosestOfTypes(token, [
		ParseTreeTokenType.CODE_BLOCK,
		ParseTreeTokenType.FUNCTION,
		ParseTreeTokenType.PROCEDURE,
		ParseTreeTokenType.TREE_ROOT
	]);
	variableName = variableName.toLowerCase();
	const results = [];
	if (container.parentNode === null ||
	container !== token.parentNode) {
		pushCandidates(container, results, variableName);
	}
	else {
		token = token.getNextSibling();
		while (token !== null) {
			pushCandidates(token, results, variableName);
			token = token.getNextSibling();
		}
	}
	return results;
};