import { getParseTreeTokenTypeForString } from './getParseTreeTokenTypeForString.js';
import { ParseTreeToken } from '../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

export function scanTokenToParseToken(token) {
	let type;
	if (token.isStringLiteral)
		type = ParseTreeTokenType.STRING_LITERAL;
	else
		type = getParseTreeTokenTypeForString(token.s);
	return new ParseTreeToken(token.s, token.lineIndex, token.colIndex, type);
};