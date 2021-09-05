import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { getCounterVariableNameFromFor, getCounterInitTokenFromFor } from
'../../../../translation-to-weblogo/type-processors/for-loops/getCounterVariableNameFromFor.js';
import { Variable } from
'./Variable.js';

function isOfInterest(token) {
	return getCounterVariableNameFromFor(token) !== undefined;
}

export function addVariablesFromForLoops(root, result) {
	const fors = getDescendentsOfType(root, ParseTreeTokenType.FOR).
		filter(isOfInterest);
	fors.forEach(function(forToken) {
		const variableName = getCounterVariableNameFromFor(forToken);
		const assignmentToken = getCounterInitTokenFromFor(forToken);
		let variable = result.get(variableName);
		if (variable === undefined) {
			variable = new Variable(variableName);
			result.set(variableName, variable);
		}
		variable.addAssignment(assignmentToken);
	});
};