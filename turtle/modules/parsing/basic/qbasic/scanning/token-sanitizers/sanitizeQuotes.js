import { SetUtils } from
'../../../../../SetUtils.js';

const quotationReplacements = new Map([
	['“', '"'],
	['”', '"']
]);
const quotes = new Set(['"']);
SetUtils.addAll(quotes, quotationReplacements.keys());

function isLikelyStringLiteral(s) {
	if (s.length < 2)
		return false;
	const first = s[0];
	const last = s[s.length - 1];
	return quotes.has(first) && quotes.has(last);
}

function sanitizeStringLiteral(s) {
	if (!isLikelyStringLiteral(s))
		return s;

	const first = s[0];
	const last = s[s.length - 1];
	const firstReplacement = quotationReplacements.get(first);
	const lastReplacement = quotationReplacements.get(last);
	if (firstReplacement !== undefined)
		s = firstReplacement + s.substring(1);
	if (lastReplacement !== undefined)
		s = s.substring(0, s.length - 1) + lastReplacement;
	return s;
}

export function sanitizeQuotes(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		token.s = sanitizeStringLiteral(token.s);
	}
};