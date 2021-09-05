import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function stripRegularQuotes(s) {
	const first = s[0];
	if (first === '"' ||
	first === '\'') {
		s = s.substring(1);
		if (s.endsWith(first))
			return s.substring(0, s.length - 1);
		return s;
	}
	return s;
}

function stripLongQuotes(s) {
	const first = s[0];
	if (first === '"' ||
	first === '\'') {
		s = s.substring(3);
		if (s.endsWith(first))
			return s.substring(0, s.length - 3);
		return s;
	}
	return s;
}

export function getStringLiteralValue(token) {
	if (token.type === ParseTreeTokenType.STRING_LITERAL)
		return stripRegularQuotes(token.val);
	else
		return stripLongQuotes(token.val);
};