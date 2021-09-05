import { ParseTreeToken } from './ParseTreeToken.js';

export function tokenToParseTreeToken(stringToTokenType) {
	if (typeof stringToTokenType !== 'function')
		throw new Error(`stringToTokenType must be a function but got ${stringToTokenType}`);
	return function(token, extraInfo) {
		const type = stringToTokenType(token.s, extraInfo);
		return new ParseTreeToken(token.s, token.lineIndex, token.colIndex, type);
	};
};