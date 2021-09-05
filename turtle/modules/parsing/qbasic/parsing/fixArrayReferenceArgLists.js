import { addVariablesFromDims } from
'./parse-tree-analysis/variable-data-types/variables/addVariablesFromDims.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function getAllArrayVariables(root) {
	const result = new Map();
	addVariablesFromDims(root, result);
	return result;
}

function isOfInterest(variables) {
	return function(token) {
		const firstChild = token.children[0];
		if (firstChild === undefined ||
		firstChild.type !== ParseTreeTokenType.IDENTIFIER ||
		!variables.has(firstChild.val.toLowerCase()))
			return false;
		return true;
	};
}

function getTokenToMoveArgsTo(token) {
	while (token !== null) {
		const parent = token.parentNode;
		if (parent === null)
			return null;
		if (parent.type === ParseTreeTokenType.ARG_LIST ||
		parent.type === ParseTreeTokenType.TUPLE_LITERAL)
			return token;
		token = parent;
	}
	return null;
}

export function fixArrayReferenceArgLists(root) {
	const variables = getAllArrayVariables(root);
	const calls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest(variables));
	// any arg list that starts with a ( should end with ).
	for (const call of calls) {
		const argList = call.children[1];
		const children = argList.children;
		const first = children[0];
		if (first.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
			continue;
		const newParent = getTokenToMoveArgsTo(call);
		if (newParent === null)
			continue;
		const firstChildrenLength = first.children.length;
		first.removeSingleToken();
		for (let i = argList.children.length - 1; i >= firstChildrenLength; i--) {
			const child = argList.children[i];
			child.remove();
			newParent.appendSibling(child);
		}
	}
};