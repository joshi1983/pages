import { addVariableDeclaration } from './addVariableDeclaration.js';
import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

function processToken(token, result) {
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		addVariableDeclaration(token, result);
	}
	else if (token.type === ParseTreeTokenType.ARG_LIST ||
	token.type === ParseTreeTokenType.AS)
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