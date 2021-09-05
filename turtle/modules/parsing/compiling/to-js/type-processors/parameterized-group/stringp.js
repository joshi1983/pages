import { processToken } from
'../processToken.js';

export function stringp(token, result, options) {
	result.append('(typeof ');
	processToken(token.children[0], result, options);
	result.append(' === "string")');
};