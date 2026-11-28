import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const typesToSkip = new Set([
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.FUNCTION_DEFINITION
]);

function isAssignmentOfInterest(assignment) {
	const children = assignment.children;
	if (children.length < 2)
		return false;

	const firstChild = children[0];
	if (firstChild === undefined ||
	firstChild.type !== ParseTreeTokenType.IDENTIFIER ||
	firstChild.children.length !== 0)
		return false;
	return true;
}

function mightChangeTypesFor(token, types, variableName, tokenToTypesMap) {
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.children.length === 2) {
		const firstChild = token.children[0];
		if (firstChild.children.length === 0 &&
		firstChild.val === variableName) {
			const rightChild = token.children[1];
			const rightTypes = tokenToTypesMap.get(rightChild);
			if (rightTypes !== types)
				return true;
		}
	}
	// FIXME: if token is a call to a custom/not built in function,
	// and that function has a global statement including variableName
	// return true.

	for (const child of token.children) {
		if (mightChangeTypesFor(child, types, variableName, tokenToTypesMap)) {
			return true;
		}
	}
	return false;
}

function isVariableRead(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.CLASS ||
	parent.type === ParseTreeTokenType.DOT ||
	parent.type === ParseTreeTokenType.FUNCTION_CALL ||
	parent.type === ParseTreeTokenType.FUNCTION_DEFINITION)
		return false;

	const grandParent = parent.parentNode;
	if (grandParent !== null) {
		if (parent.type === ParseTreeTokenType.ARGUMENT_LIST &&
		grandParent.type === ParseTreeTokenType.FUNCTION_DEFINITION) {
			return false;
		}
	}
	return true;
}

export function propogateTypesAssignedToVariables(root, result) {
	const assignments = getDescendentsOfType(root, ParseTreeTokenType.ASSIGNMENT_OPERATOR).
		filter(isAssignmentOfInterest);
	for (const assignment of assignments) {
		const firstChild = assignment.children[0];
		const types = result.get(assignment.children[1]);
		if (types !== undefined) {
			const codeBlock = assignment.parentNode;
			if (codeBlock.type === ParseTreeTokenType.CODE_BLOCK ||
			codeBlock.type === ParseTreeTokenType.TREE_ROOT) {
				const variableName = firstChild.val;
				const children = codeBlock.children;
				for (let i = children.indexOf(assignment) + 1; i < children.length; i++) {
					const child = children[i];
					if (!typesToSkip.has(child.type)) {					
						if (mightChangeTypesFor(child, types, variableName, result))
							break;

						const variableReads = getDescendentsOfType(child, ParseTreeTokenType.IDENTIFIER).
							filter(isVariableRead);
						for (const variableRead of variableReads) {
							result.set(variableRead, types);
						}
					}
				}
			}
		}
	}
};