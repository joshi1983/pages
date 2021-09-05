import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';

export function methodCallTokenToArgTypes(token, cachedParseTree) {
	const children = token.children;
	if (children.length !== 2)
		return [];
	const argsToken = children[1];
	const argTokens = filterBracketsAndCommas(argsToken.children);
	const tokenTypes = cachedParseTree.getTokensToDataTypes();
	return argTokens.map(function(argToken) {
		const dataTypes = tokenTypes.get(argToken);
		if (typeof dataTypes !== 'string')
			return '*';
		else
			return dataTypes;
	});
};