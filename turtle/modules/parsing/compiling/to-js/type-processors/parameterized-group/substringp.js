import { processToken } from
'../processToken.js';

export function substringp(token, result) {
	const children = token.children;
	const s1Token = children[0];
	const s2Token = children[1];
	processToken(s1Token, result);
	result.append('.indexOf(');
	processToken(s2Token, result);
	result.append(') !== -1');
};