import { getDescendentsOfType } from
'../../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { Variable } from
'./Variable.js';

function getIdentifier(assignment) {
	const children = assignment.children;
	const firstChild = children[0];
	if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
		return firstChild;
	if (firstChild.type === ParseTreeTokenType.FUNCTION_CALL &&
	firstChild.children.length === 2) {
		const arrayToken = firstChild.children[0];
		if (arrayToken.type === ParseTreeTokenType.IDENTIFIER)
			return arrayToken;
	}
}

function isOfInterest(token) {
	return getIdentifier(token) !== undefined;
}

export function addVariablesFromAssignments(root, result) {
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
		variable.addAssignment(assignmentToken);
	});
};