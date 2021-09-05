import { createTokenFromToken } from './createTokenFromToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nextTypesOfInterest = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.LONG_STRING_LITERAL
]);

function getGoodPrevious(prev) {
	if (prev.type === ParseTreeTokenType.DICTIONARY_LITERAL)
		return prev;
	if (prev.type !== ParseTreeTokenType.DICTIONARY_KEY_VALUE_PAIR)
		return prev;
	return prev;
}

export function addDictionaryKeyValuePairIfNeeded(prev, next) {
	if (!nextTypesOfInterest.has(next.type))
		return prev;
	prev = getGoodPrevious(prev);
	if (prev.type === ParseTreeTokenType.DICTIONARY_LITERAL) {
		const newToken = createTokenFromToken(null, next, ParseTreeTokenType.DICTIONARY_KEY_VALUE_PAIR);
		prev.appendChild(newToken);
		return newToken;
	}
	return prev;
};