import { addVariableDeclaration } from './addVariableDeclaration.js';
import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

function processToken(token, result) {
	for (const child of token.children) {
		if (child.type === ParseTreeTokenType.IDENTIFIER) {
			addVariableDeclaration(child, result);
		}
	}
}

export function addVariablesFromDefPrimitives(root, result) {
	const defs = getDescendentsOfType(root, ParseTreeTokenType.DEF_PRIMITIVE);
	defs.forEach(function(def) {
		processToken(def, result);
	});
};