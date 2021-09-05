import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';
import { Token } from
'../../../Token.js';

function isFuncOfInterest(scanTokens, i) {
	if (i > scanTokens.length - 2)
		return false;
	const token = scanTokens[i];
	if (token.s.toLowerCase() !== 'func')
		return false;

	const next = scanTokens[i + 1];
	if (!isIdentifier(next.s))
		return false;

	const nNext = scanTokens[i + 2];
	if (nNext.s !== '(')
		return false;

	return true;
}

function isEndFnOfInterest(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s.toLowerCase() !== 'endfn')
		return false;

	return true;
}

export function funcToDef(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (isFuncOfInterest(scanTokens, i)) {
			token.s = 'def';
		}
		if (isEndFnOfInterest(scanTokens, i)) {
			token.s = 'end';
			scanTokens.splice(i + 1, 0, new Token('def', token.colIndex, token.lineIndex));
			token.colIndex -= 2;
		}
	}
};