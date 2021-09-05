import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const namesAssigning = new Set([
	'input', 'input$'
]);

function mightAssignToVariable(token) {
	if (token === null)
		return false;
	if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		const firstChild = token.children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
			return namesAssigning.has(firstChild.val.toLowerCase());
	}
	return false;
}

export function mightAssignNewValue(variableName, token) {
	if (token.type === ParseTreeTokenType.ASSIGNMENT) {
		const first = token.children[0];
		if (first !== undefined &&
		first.type === ParseTreeTokenType.IDENTIFIER &&
		first.val.toLowerCase() === variableName)
			return true;
	}
	else if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.val.toLowerCase() === variableName) {
		if (mightAssignToVariable(token.parentNode.parentNode))
			return true;
	}
	for (const child of token.children) {
		if (mightAssignNewValue(variableName, child))
			return true;
	}
	return false;
};