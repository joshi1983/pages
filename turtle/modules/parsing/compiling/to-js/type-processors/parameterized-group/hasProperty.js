import { processToken } from
'../processToken.js';

export function hasProperty(token, result) {
	const children = token.children;
	const mapToken = children[0];
	const keyToken = children[1];
	processToken(mapToken, result);
	result.append('.hasProperty(');
	processToken(keyToken, result);
	result.append(') !== -1');
};