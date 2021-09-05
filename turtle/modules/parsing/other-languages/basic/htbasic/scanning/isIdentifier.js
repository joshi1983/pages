import { isIdentifier as qbIsIdentifier } from
'../../qbasic/scanning/isIdentifier.js';

const keywords = new Set([
	'END', 'FOR', 'IF', 'REPEAT', 'SUBEND', 'UNTIL'
]);

export function isIdentifier(s) {
	if (s.length > 15)
		return false;

	if (keywords.has(s))
		return false;

	return qbIsIdentifier(s);
};