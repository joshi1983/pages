import { processToken } from './processToken.js';

export function processWhile(token, result) {
	const children = token.children;
	if (children.length >= 2) {
		const condition = children[0];
		const codeBlock = children[1];
		result.append(' while ');
		processToken(condition, result);
		processToken(codeBlock, result);
	}
};