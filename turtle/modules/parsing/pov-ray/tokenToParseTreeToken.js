import { ParseTreeToken } from
'../generic-parsing-utilities/ParseTreeToken.js';
import { stringToTokenType } from './stringToTokenType.js';

export function tokenToParseTreeToken(token) {
	const type = stringToTokenType(token.s);
	return new ParseTreeToken(token.s, token.lineIndex, token.colIndex, type);
};