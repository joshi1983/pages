import { getAllFunctionDefinitions } from './getAllFunctionDefinitions.js';

export function getFunctionDefinitionsAt(cachedParseTree, token) {
	const functionDefinitions = getAllFunctionDefinitions(cachedParseTree);
	return functionDefinitions.filter(fd => fd.isContainingToken(token));
};