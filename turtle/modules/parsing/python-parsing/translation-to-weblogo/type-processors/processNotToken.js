import { printChildren } from './helpers/printChildren.js';

export function processNotToken(token, result, cachedParseTree) {
	result.append('not ');
	printChildren(token, result, cachedParseTree);
};