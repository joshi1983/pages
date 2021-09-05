import { processToken } from
'../processToken.js';

export function createPList2(token, result, options) {
	result.append('new Map(');
	processToken(token.children[0], result, options);
	result.append(')');
};