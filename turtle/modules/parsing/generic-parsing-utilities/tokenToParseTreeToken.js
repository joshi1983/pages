import { ParseTreeToken } from './ParseTreeToken.js';

export function tokenToParseTreeToken(stringToTokenType) {
	if (typeof stringToTokenType !== 'function')
		throw new Error(`stringToTokenType must be a function but got ${stringToTokenType}`);
	return function(token) {
		const type = stringToTokenType(token.s);
		return new ParseTreeToken(token.s, token.lineIndex, token.colIndex, type);
	};
};