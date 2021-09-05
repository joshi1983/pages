import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

function getWhitespaceLength(prev, next) {
	if (prev.lineIndex === next.lineIndex) {
		return next.colIndex - prev.colIndex - next.s.length;
	}
	else if (next.colIndex <= next.s.length)
		return 0;
	else
		return next.colIndex - next.s.length;
}

function getJoinLength(tokens, i) {
	const token = tokens[i];
	if (token.s[0] !== '"')
		return [0, ''];
	if (i > 0) {
		// Check if tokens[i] is already partly translated to WebLogo.
		// For example, make "x 3
		// In that example, we don't want to look for a closing " after the "x because
		// that's already a WebLogo style string literal.  
		// There is no closing " to look for in WebLogo's type of string literal.
		const prev = tokens[i - 1];
		if (prev.s.toLowerCase() === 'make')
			return [0, ''];
	}
	let val = '';
	let j;
	for (j = i; j < tokens.length; j++) {
		const s = tokens[j].s;
		const gap = i === j ? 0 : getWhitespaceLength(tokens[j - 1], tokens[j]);
		val += ' '.repeat(gap) + s;
		const lastIndex = s.lastIndexOf('"');
		if (lastIndex !== -1 &&
		(lastIndex !== 0 || i !== j)) {
			break;
		}
	}
	if (!val.endsWith('"'))
		val += '"';

	return [j + 1 - i, val];
}

function seaTurtleLiteralToValue(s) {
	if (s[0] === '"')
		s = s.substring(1);
	if (s[s.length - 1] === '"')
		s = s.substring(0, s.length - 1);
	return s;
}

export function joinLongStringLiterals(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const joinInfo = getJoinLength(tokens, i);
		if (joinInfo[0] > 1) {
			tokens[i].s = valueToLiteralCode(seaTurtleLiteralToValue(joinInfo[1]));
			tokens.splice(i + 1, joinInfo[0] - 1); // remove the other tokens that were merged into the one.
		}
	}
};