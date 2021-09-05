import { addVariableDeclaration } from './addVariableDeclaration.js';
import { getDescendentsOfType } from
'../../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export const stopDescentTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.AS,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.TUPLE_LITERAL
]);

function processToken(token, result) {
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		addVariableDeclaration(token, result);
	}
	else if (stopDescentTypes.has(token.type))
		return;
	
	for (const child of token.children) {
		processToken(child, result);
	}
}

export function addVariablesFromDims(root, result) {
	const dims = getDescendentsOfType(root, ParseTreeTokenType.DIM);
	dims.forEach(function(dim) {
		processToken(dim, result);
	});
};