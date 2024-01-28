import { printChildren } from './helpers/printChildren.js';

export function processUnrecognizedToken(token, result, cachedParseTree) {
	printChildren(token, result, cachedParseTree);
};