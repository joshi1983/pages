import { quotationReplacements } from
'../../../../basic/qbasic/scanning/token-sanitizers/sanitizeQuotes.js';

export function isStringLiteralStart(s) {
	const firstChar = s[0];
	if (firstChar !== '"' && firstChar !== "'" &&
	!quotationReplacements.has(firstChar))
		return false;

	return true;
};