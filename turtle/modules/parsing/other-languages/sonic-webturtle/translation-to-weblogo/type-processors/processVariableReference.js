export function processVariableReference(token, result, settings) {
	let varName = token.val;
	if (settings.variableNamesMap.has(varName.toLowerCase()))
		varName = settings.variableNamesMap.get(varName.toLowerCase());
	result.append(` :${varName} `);
};