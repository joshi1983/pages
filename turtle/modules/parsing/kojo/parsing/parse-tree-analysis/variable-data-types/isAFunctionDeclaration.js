import { isFunctionDefinitionName } from './isFunctionDefinitionName.js';

export function isAFunctionDeclaration(declaration) {
	if (isFunctionDefinitionName(declaration))
		return true;

	return false;
};