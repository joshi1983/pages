import { processToken } from
'../processToken.js';

export function stringp(token, result) {
	result.append('(typeof ');
	processToken(token.children[0], result);
	result.append(' === "string")');
};