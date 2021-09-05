import { printChildren } from './helpers/printChildren.js';

export function processUnrecognizedToken(token, result, cachedParseTree, settings) {
	printChildren(token, result, cachedParseTree, settings);
};