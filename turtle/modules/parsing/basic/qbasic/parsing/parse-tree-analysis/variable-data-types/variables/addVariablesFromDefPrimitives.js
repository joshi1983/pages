import { addVariableDeclaration, addVariableDeclarationWithName } from
'./addVariableDeclaration.js';
import { getDescendentsOfType } from
'../../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

function processToken(token, result) {
	for (const child of token.children) {
		const children = child.children;
		if (child.type === ParseTreeTokenType.IDENTIFIER) {
			addVariableDeclaration(child, result);
		}
		else if (child.type === ParseTreeTokenType.BINARY_OPERATOR &&
		child.val === '-' &&
		children.length === 2) {
			const from = children[0];
			const to = children[1];
			if (from.type === ParseTreeTokenType.IDENTIFIER &&
			from.val.length === 1 &&
			to.type === ParseTreeTokenType.IDENTIFIER &&
			to.val.length === 1) {
				const endCode = to.val.toLowerCase().charCodeAt(0);
				for (let i = from.val.toLowerCase().charCodeAt(0); i <= endCode; i++) {
					const ch = String.fromCharCode(i);
					addVariableDeclarationWithName(child, ch, result);
				}
			}
		}
	}
}

export function addVariablesFromDefPrimitives(root, result) {
	const defs = getDescendentsOfType(root, ParseTreeTokenType.DEF_PRIMITIVE);
	defs.forEach(function(def) {
		processToken(def, result);
	});
};