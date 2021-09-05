import { processToken } from
'../processToken.js';

export function substringp(token, result, options) {
	const children = token.children;
	const s1Token = children[0];
	const s2Token = children[1];
	processToken(s1Token, result, options);
	result.append('.indexOf(');
	processToken(s2Token, result, options);
	result.append(') !== -1');
};