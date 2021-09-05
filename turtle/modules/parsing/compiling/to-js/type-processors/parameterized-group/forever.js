import { processToken } from
'../processToken.js';

export function forever(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const instructionsToken = children[0];
	result.append('\nwhile (true) {\n');
	if (instructionsToken !== undefined) {
		processToken(instructionsToken, result, options);
	}
	result.append('\n}\n');
};