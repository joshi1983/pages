import { convertToFunctionCall } from './convertToFunctionCall.js';
import { getDeclarationAtToken } from
'./parse-tree-analysis/variable-data-types/getDeclarationAtToken.js';
import { getDescendentsOfTypes } from
'../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { getIdentifiersInfo } from
'./parse-tree-analysis/variable-data-types/getIdentifiersInfo.js';
import { isAFunctionDeclaration } from
'./parse-tree-analysis/variable-data-types/isAFunctionDeclaration.js';
import { isFunctionDefinitionName } from
'./parse-tree-analysis/variable-data-types/isFunctionDefinitionName.js';
import { MigrationInfo } from
'../MigrationInfo.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isOfInterest(root) {
	const identifiersInfoMap = getIdentifiersInfo(root);
	return function(token) {
		const parentToken = token.parentNode;
		if (parentToken.type === ParseTreeTokenType.DEF ||
		parentToken.type === ParseTreeTokenType.FUNC_CALL ||
		parentToken.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY ||
		parentToken.type === ParseTreeTokenType.IMPORT)
			return false;
		if (isFunctionDefinitionName(token))
			return false;
		const firstChild = token.children[0];
		if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.COLON)
			return false; // likely a declared variable or parameter

		if (parentToken.type === ParseTreeTokenType.ARG_LIST) {
			const grandparent = parentToken.parentNode;
			if (grandparent.type === ParseTreeTokenType.DEF)
				return false; // token likely corresponds with a declared parameter.
		}
		const identifierInfo = identifiersInfoMap.get(token.val);
		if (identifierInfo !== undefined) {
			const declaration = getDeclarationAtToken(token, identifierInfo.declarations);
			if (declaration !== undefined && declaration !== token) {
				return isAFunctionDeclaration(declaration); 
			}
		}

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