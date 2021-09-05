import { processToken } from
'../processToken.js';

export function booleanp(token, result, options) {
	result.append('(typeof ');
	processToken(token.children[0], result, options);
	result.append(' === "boolean")');
};