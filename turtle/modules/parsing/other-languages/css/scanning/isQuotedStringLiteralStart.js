export function isQuotedStringLiteralStart(s) {
	const ch = s[0];
	return ch === '"' || ch === '\'';
}