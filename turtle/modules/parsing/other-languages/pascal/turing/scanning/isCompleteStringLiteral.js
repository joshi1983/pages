import { isStringLiteralStart } from './isStringLiteralStart.js';
import { quotationReplacements } from
'../../../../basic/qbasic/scanning/token-sanitizers/sanitizeQuotes.js';

export function isThickQuoteEquivalent(ch) {
	return ch === '"' ||
	quotationReplacements.has(ch);
};

export function isCompleteStringLiteral(s) {
	const firstChar = s[0];
	if (s.length < 2 || !isStringLiteralStart(s))
		return false;

	const lastChar = s[s.length - 1];
	if (lastChar !== firstChar) {
		if (isThickQuoteEquivalent(firstChar) &&
		isThickQuoteEquivalent(lastChar))
			return true;

		return false;
	}
	// FIXME: can " be escaped so a string literal can express a string that contains the " character?

	return true;
};