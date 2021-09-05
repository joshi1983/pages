import { processToken } from
'../processToken.js';

export function forever(token, result) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const instructionsToken = children[0];
	result.append('\nwhile (true) {\n');
	if (instructionsToken !== undefined) {
		processToken(instructionsToken, result);
	}
	result.append('\n}\n');
};