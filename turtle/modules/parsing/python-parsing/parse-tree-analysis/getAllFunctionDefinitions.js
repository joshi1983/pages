import { FunctionDefinition } from './FunctionDefinition.js';
import { getLastDescendentTokenOf } from '../../parse-tree-token/getLastDescendentTokenOf.js';
import { tokenToFunctionDefinitionName } from './function-definition/tokenToFunctionDefinitionName.js';
import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function getStartToken(token) {
	if (token.children.length !== 0 && token.children[0].type === ParseTreeTokenType.DEF)
		return token.children[0];
	return token;
}

export function getAllFunctionDefinitions(cachedParseTree) {
	if (typeof cachedParseTree.root !== 'object')
		throw new Error(`cachedParseTree must be an object with a root token.  It should more specifically be a CachedParseTree instance.`);

	if (cachedParseTree.functionDefinitions === undefined) {
		const functionDefinitions = [];
		const definitionTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_DEFINITION);
		for (let i = 0; i < definitionTokens.length; i++) {
			const token = definitionTokens[i];
			const name = tokenToFunctionDefinitionName(token);
			const startToken = getStartToken(token);
			const lastToken = getLastDescendentTokenOf(token);
			functionDefinitions.push(new FunctionDefinition(name, startToken, token, lastToken));
		}
		cachedParseTree.functionDefinitions = functionDefinitions;
	}
	return cachedParseTree.functionDefinitions;
};