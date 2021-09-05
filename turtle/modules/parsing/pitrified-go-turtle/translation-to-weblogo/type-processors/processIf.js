import { processToken } from './processToken.js';

export function processIf(token, result, settings) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const condition = children[0];
	if (condition !== undefined) {
		result.append('\nif ');
		processToken(condition, result, settings);
		result.append(' [\n');
		for (let i = 1; i < children.length; i++) {
			processToken(children[i], result, settings);
		}
		result.append('\n]\n');
	}
};