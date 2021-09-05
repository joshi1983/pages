import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';

function getLengthToRemove(tokens, i) {
	const prev = tokens[i - 1];
	const prevS = prev.s.toLowerCase();
	if (prevS !== 'gosub' &&
	prevS !== 'goto')
		return 0;
	const token = tokens[i];
	if (token.s !== '[')
		return 0;

	const nameToken = tokens[i + 1];
	if (nameToken === undefined ||
	(nameToken.s.toLowerCase() !== 'sub' && !isIdentifier(nameToken.s)))
		return 0;

	if (nameToken.s.toLowerCase() === 'sub') {
		const colonToken = tokens[i + 2];
		if (colonToken === undefined || colonToken.s !== ':')
			return 0;
		const nameToken = tokens[i + 3];
		if (nameToken === undefined || !isIdentifier(nameToken.s))
			return 0;
		const closingBracket = tokens[i + 4];
		if (closingBracket === undefined ||
		closingBracket.s !== ']')
			return 0;
		return 5;
	}

	const closingBracket = tokens[i + 2];
	if (closingBracket === undefined ||
	closingBracket.s !== ']')
		return 0;

	return 3;
}

export function removeGoSubSquareBrackets(tokens) {
	for (let i = 1; i < tokens.length; i++) {
		const len = getLengthToRemove(tokens, i);
		if (len > 0) {
			const nameToken = tokens[i + len - 2];
			tokens.splice(i, len, nameToken);
		}
	}
};