import { processToken } from
'../processToken.js';

export function item(token, result, options) {
	const children = token.children;
	const indexToken = children[0];
	const arrayToken = children[1];
	processToken(arrayToken, result, options);
	result.append('[');
	processToken(indexToken, result, options);
	result.append(' - 1]');
};