import { convertToFunctionCall } from './convertToFunctionCall.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from
'../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { MigrationInfo } from
'../MigrationInfo.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isOfInterest(root) {
	const defs = getDescendentsOfType(root, ParseTreeTokenType.DEF).
		filter(function(defToken) {
			const firstChild = defToken.children[0];
			if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.IDENTIFIER)
				return true;
			return false;
		});
	const defNames = new Set(defs.map(t => t.children[0].val));
	return function(token) {
		const parentToken = token.parentNode;
		if (parentToken.type === ParseTreeTokenType.DEF ||
		parentToken.type === ParseTreeTokenType.FUNC_CALL ||
		parentToken.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY)
			return false;
		if (defNames.has(token.val))
			return true;
		const info = MigrationInfo.getFunctionInfo(token);
		return info !== undefined;
	};
}

export function sanitizeFunctionCalls(root) {
	const identifiers = getDescendentsOfTypes(root, [
		ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
		ParseTreeTokenType.IDENTIFIER
	]).
		filter(isOfInterest(root));
	identifiers.forEach(function(identifierToken) {
		convertToFunctionCall(identifierToken);
	});
};