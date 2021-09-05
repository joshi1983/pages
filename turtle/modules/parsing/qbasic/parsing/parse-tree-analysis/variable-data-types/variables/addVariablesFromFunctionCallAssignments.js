import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { Variable } from
'./Variable.js';

const funcNamesOfInterest = new Set([
	'input', 'input$', 'line input'
]);

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;
	const firstChild = children[0];
	let name;
	if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
		name = firstChild.val.toLowerCase();
	else if (firstChild.type === ParseTreeTokenType.COMPOSITE_IDENTIFIER)
		name = firstChild.children.map(f => f.val.toLowerCase()).join(' ');
	else
		return false;
	if (!funcNamesOfInterest.has(name))
		return false;

	const argList = children[1];
	return argList.children.some(t => t.type === ParseTreeTokenType.IDENTIFIER);
}

export function addVariablesFromFunctionCallAssignments(root, result) {
	const calls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest);
	calls.forEach(function(callToken) {
		const argList = callToken.children[1];
		for (const child of argList.children) {
			if (child.type !== ParseTreeTokenType.IDENTIFIER)
				continue;

			const variableName = child.val.toLowerCase();
			let variable = result.get(variableName);
			if (variable === undefined) {
				variable = new Variable(variableName);
				result.set(variableName, variable);
			}
			variable.addAssignment(child);
		}
	});
};