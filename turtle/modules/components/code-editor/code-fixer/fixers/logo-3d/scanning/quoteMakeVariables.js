import { isIdentifier } from
'./isIdentifier.js';

function isOfInterest(tokens, i) {
	const prev = tokens[i - 1];
	const prevS = prev.s.toLowerCase();
	if (prevS !== 'make' && prevS !== 'local' &&
	prevS !== 'omark' && prevS !== 'mark') {
		return false;
	}
	const token = tokens[i];
	return isIdentifier(token.s);
}

export function quoteMakeVariables(tokens) {
	for (let i = 1; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			const token = tokens[i];
			token.s = '"' + token.s;
		}
	}
};