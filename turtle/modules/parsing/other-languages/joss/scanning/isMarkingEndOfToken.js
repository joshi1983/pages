import { isIdentifier } from
'./isIdentifier.js';
import { isNumberLiteral } from
'./isNumberLiteral.js';
import { isStringLiteralComplete } from
'./isStringLiteralComplete.js';
import { isStringLiteralStart } from
'./isStringLiteralStart.js';
import { Operators } from
'../Operators.js';

const largePatterns = [
	isIdentifier,
	isNumberLiteral,
	isStringLiteralComplete,
	isStringLiteralStart,
];
const fullOperators = new Set();
for (const info of Operators.getAll()) {
	fullOperators.add(info.symbol);
}

export function isMarkingEndOfToken(s, nextChar) {
	if (s === '')
		return false;

	const s2 = (s + nextChar).toLowerCase();
	if (fullOperators.has(s2))
		return false;

	if (largePatterns.some(p => p(s2)))
		return false;

	return true;
};