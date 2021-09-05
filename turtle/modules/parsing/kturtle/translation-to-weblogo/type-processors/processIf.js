import { processToken } from '../processToken.js';

export function processIf(token, result) {
	result.processCommentsUpToToken(token);
	if (token.children.length === 2) {
		result.append('if ');
		processToken(token.children[0], result);
		processToken(token.children[1], result);
	}
	else if (token.children.length === 4) {
		result.append('ifelse ');
		processToken(token.children[0], result);
		processToken(token.children[1], result);
		processToken(token.children[3], result);
	}
};