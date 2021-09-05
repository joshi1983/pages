import { isValidIdentifier } from './isValidIdentifier.js';

function isOfInterest(tokens, i) {
	const prev = tokens[i - 1];
	const prevS = prev.s.toLowerCase();
	if (prevS !== 'set' && prevS !== 'make')
		return false;

	const token = tokens[i];
	const tokenS = token.s;
	if (tokenS[0] === '"')
		return false;

	return isValidIdentifier(tokenS);
}

export function addQuotesInSetStatements(tokens) {
	for (let i = 1; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			tokens[i].s = '"' + tokens[i].s;
			tokens[i - 1].s = 'make';
		}
	}
};