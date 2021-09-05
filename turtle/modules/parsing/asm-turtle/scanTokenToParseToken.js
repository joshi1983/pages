import { getParseTreeTokenTypeForString } from './getParseTreeTokenTypeForString.js';
import { ParseTreeToken } from '../generic-parsing-utilities/ParseTreeToken.js';

export function scanTokenToParseToken(token) {
	const type = getParseTreeTokenTypeForString(token.s);
	return new ParseTreeToken(token.s, token.lineIndex, token.colIndex, type);
};