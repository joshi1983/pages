import { processToken } from '../processToken.js';

export function processTreeRoot(token, result) {
	const children = token.children;
	if (children.length !== 0)
		result.processCommentsUpToToken(children[0]);
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		processToken(child, result);
	}
};