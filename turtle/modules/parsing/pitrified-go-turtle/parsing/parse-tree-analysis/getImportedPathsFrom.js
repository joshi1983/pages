import { evaluateStringLiteral } from
'../../evaluation/evaluateStringLiteral.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { SetUtils } from
'../../../../SetUtils.js';

function getPathsFrom(token) {
	if (token.type === ParseTreeTokenType.STRING_LITERAL)
		return [evaluateStringLiteral(token)];
	else if (token.type === ParseTreeTokenType.IMPORT_PACKAGE_LIST) {
		return token.children.filter(t => t.type === ParseTreeTokenType.STRING_LITERAL).
			map(evaluateStringLiteral);
	}
	return [];
}

export function getImportedPathsFrom(root) {
	if (typeof root !== 'object')
		throw new Error(`root must be an object, more specifically a ParseTreeToken but found ${root}`);
	const imports = getDescendentsOfType(root, ParseTreeTokenType.IMPORT);
	const result = new Set();
	imports.forEach(function(token) {
		for (const child of token.children) {
			SetUtils.addAll(result, getPathsFrom(child));
		}
	});
	return result;
};