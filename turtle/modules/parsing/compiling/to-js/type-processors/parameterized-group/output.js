import { processToken } from
'../processToken.js';

export function output(token, result) {
	result.processCommentsUpToToken(token);
	const firstChild = token.children[0];
	result.append('\nreturn');
	if (firstChild === undefined)
		result.append(';\n');
	else {
		result.append(' ');
		processToken(firstChild, result);
		result.append(';\n');
	}
};