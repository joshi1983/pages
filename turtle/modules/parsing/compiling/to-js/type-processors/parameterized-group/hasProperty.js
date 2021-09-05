import { processToken } from
'../processToken.js';

export function hasProperty(token, result, options) {
	const children = token.children;
	const mapToken = children[0];
	const keyToken = children[1];
	processToken(mapToken, result, options);
	result.append('.hasProperty(');
	processToken(keyToken, result, options);
	result.append(') !== -1');
};