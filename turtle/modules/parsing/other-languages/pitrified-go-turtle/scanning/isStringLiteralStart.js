export function isStringLiteralStart(s) {
	const ch = s[0];
	return ch === '"' || ch === '`';
};