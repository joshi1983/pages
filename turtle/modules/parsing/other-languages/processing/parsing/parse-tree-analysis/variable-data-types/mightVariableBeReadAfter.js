import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const falseParentTypes = new Set([
	ParseTreeTokenType.METHOD,
	ParseTreeTokenType.TREE_ROOT
]);

function mightReadVariable(token, variableName) {
	if (token.type === ParseTreeTokenType.IDENTIFIER && token.val === variableName) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.DOT)
			return false;
		if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
			if (parent.children.indexOf(token) === 0 &&
			token.children.length === 0) {
				return false;
			}
		}

		return true;
	}
	for (const child of token.children) {
		if (mightReadVariable(child, variableName))
			return true;
	}
	return false;
}

function isAssignmentTo(token, variableName) {
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.val === '=') {
		const left = token.children[0];
		if (left.type === ParseTreeTokenType.IDENTIFIER && left.val === variableName) {
			const firstChild = left.children[0];
			if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.DOT)
				return false; // assigning to a property of the variable's value but not replacing the whole value.

			return true;
		}
	}
	return false;
}

export function mightVariableBeReadAfter(token, variableName) {
	const nextStart = token.getNextSibling();
	if (nextStart === null) {
		if (falseParentTypes.has(token.parentNode.type))
			return false;
	} else {
		token = nextStart;
	}
	while (token !== null) {
		const next = token.getNextSibling();
		if (isAssignmentTo(token, variableName))
			return false;
		if (mightReadVariable(token, variableName)) {
			return true;
		}
		if (next === null) {
			const parent = token.parentNode;
			if (falseParentTypes.has(parent.type))
				return false;
		}
		token = next;
	}
	return true;
};