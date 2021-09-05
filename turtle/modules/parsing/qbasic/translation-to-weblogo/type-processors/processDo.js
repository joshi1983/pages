import { processToken } from './processToken.js';

export function processDo(token, result) {
	const children = token.children;
	const codeBlock = children[0];
	const loopWhile = children[1];
	const whileToken = loopWhile.children[1];
	const condition = whileToken.children[0];
	result.append('do.while ');
	processToken(codeBlock, result);
	processToken(condition, result);
};