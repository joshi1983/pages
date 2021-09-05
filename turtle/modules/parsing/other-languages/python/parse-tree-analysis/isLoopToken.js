import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const loopTypes = new Set([
ParseTreeTokenType.FOR_LOOP,
ParseTreeTokenType.WHILE_LOOP
]);

export function isLoopToken(token) {
	return loopTypes.has(token.type);
};