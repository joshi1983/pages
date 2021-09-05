import { getDescendentsOfType } from
'../../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { Variable } from
'./Variable.js';

function getIdentifier(assignment) {
	const children = assignment.children;
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.FUNCTION_CALL ||
	firstChild.children.length !== 2)
		return;

	const nameToken = firstChild.children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.children.length !== 0)
		return;

	const argList = firstChild.children[1];
	if (argList.children.length < 3)
		return;

	return nameToken;
}

function isOfInterest(token) {
	return getIdentifier(token) !== undefined;
}

export function addVariablesFromArrayElementAssignments(root, result) {
	const assignments = getDescendentsOfType(root, ParseTreeTokenType.ASSIGNMENT).
		filter(isOfInterest);
	assignments.forEach(function(assignmentToken) {
		const identifier = getIdentifier(assignmentToken);
		const variableName = identifier.val.toLowerCase();
		let variable = result.get(variableName);
		if (variable === undefined) {
			variable = new Variable(variableName);
			result.set(variableName, variable);
		}
		variable.addArrayElementAssignment(assignmentToken);
	});
};