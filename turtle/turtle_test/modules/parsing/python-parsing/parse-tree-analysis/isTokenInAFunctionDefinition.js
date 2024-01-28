import { getFunctionDefinitionsAt } from './getFunctionDefinitionsAt.js';

export function isTokenInAFunctionDefinition(cachedParseTree, token) {
	return getFunctionDefinitionsAt(cachedParseTree, token).length !== 0;
};