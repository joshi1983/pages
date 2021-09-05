import { getFunctionDefinitionsAt } from './getFunctionDefinitionsAt.js';

export function isVariableLocalAtToken(cachedParseTree, varName, token) {
	const functions = getFunctionDefinitionsAt(cachedParseTree, token);
	// FIXME: sort functions so the most deeply nested function is at index [0].
	if (functions.length === 0)
		return false;

	for (let i = 0; i < functions.length; i++) {
		const function1 = functions[i];
		if (function1.declaresGlobalName(varName))
			return false;
		if (function1.usesParameterName(varName))
			return true;
	}

	return true;
};