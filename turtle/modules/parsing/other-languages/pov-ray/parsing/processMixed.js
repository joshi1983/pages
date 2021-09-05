import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processMixed(prev, next) {
	prev.appendChild(next);
	if (prev.type !== ParseTreeTokenType.ARRAY)
		next.type = ParseTreeTokenType.IDENTIFIER;
	return prev;
};