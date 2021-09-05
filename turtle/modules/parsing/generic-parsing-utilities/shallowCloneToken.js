import { ParseTreeToken } from './ParseTreeToken.js';

export function shallowCloneToken(token) {
	return new ParseTreeToken(token.val, token.lineIndex, token.colIndex, token.type, token.originalString);
};