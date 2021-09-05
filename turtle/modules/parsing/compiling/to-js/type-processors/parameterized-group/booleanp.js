import { processToken } from
'../processToken.js';

export function booleanp(token, result) {
	result.append('(typeof ');
	processToken(token.children[0], result);
	result.append(' === "boolean")');
};