import { processToken } from './processToken.js';

export function processRepeat(token, result, settings) {
	result.processCommentsUpToToken(token);
	result.trimRight();
	if (token.children.length !== 0) {
		result.trimRight();
		result.append('\nrepeat ');
		processToken(token.children[0], result, settings);
	}
	result.append(' [\n');
	if (token.children.length > 1) {
		processToken(token.children[1], result, settings);
	}

	result.append('\n]\n');
};