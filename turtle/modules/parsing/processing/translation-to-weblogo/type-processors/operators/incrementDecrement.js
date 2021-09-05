import { shouldUseLocalmake } from './shouldUseLocalmake.js';

function getVarNameToken(token) {
	if (token.children.length !== 0)
		return token.children[0];
	return token.parentNode;
}

export function incrementDecrement(token, result, settings) {
	const symbol = token.val[0];
	const children = token.children;
	const varNameToken = getVarNameToken(token);
	const varName = varNameToken.val;
	result.append(' ');
	if (shouldUseLocalmake(token))
		result.append('local');
	result.append(`make "${varName} :${varName} ${symbol} 1`);
};