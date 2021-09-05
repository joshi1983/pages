import { processToken } from
'../processToken.js';

export function item(token, result) {
	const children = token.children;
	const indexToken = children[0];
	const arrayToken = children[1];
	processToken(arrayToken, result);
	result.append('[');
	processToken(indexToken, result);
	result.append(' - 1]');
};