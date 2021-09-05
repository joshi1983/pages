import { createTokenFromToken } from './createTokenFromToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processCurlyLeftBracket(prev, next) {
	const dictionaryLiteral = createTokenFromToken(null, next, ParseTreeTokenType.DICTIONARY_LITERAL);
	prev.appendChild(dictionaryLiteral);
	dictionaryLiteral.appendChild(next);
	return dictionaryLiteral;
};