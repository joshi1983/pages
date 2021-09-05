import { processToken } from './processToken.js';

export function processAssert(token, result) {
	const children = token.children;
	if (children.length !== 0) {
		result.processCommentsUpToToken(token);
		result.append('\nassert ');
		processToken(token.children[0], result);
	}
};