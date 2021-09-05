import { isLocalVariablesDeclaration } from '../token-classifiers/isLocalVariablesDeclaration.js';

export function isLocalVariablesDeclared(allTokens) {
	return allTokens.some(isLocalVariablesDeclaration);
};