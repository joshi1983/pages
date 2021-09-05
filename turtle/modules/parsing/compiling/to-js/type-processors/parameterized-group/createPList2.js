import { processToken } from
'../processToken.js';

export function createPList2(token, result) {
	result.append('new Map(');
	processToken(token.children[0], result);
	result.append(')');
};