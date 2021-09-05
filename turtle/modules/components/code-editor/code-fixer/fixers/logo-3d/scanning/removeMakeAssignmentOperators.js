import { isIdentifier } from './isIdentifier.js';

function isOfInterest(tokens, i) {
	if (i >= tokens.length - 1)
		return false;

	const makeToken = tokens[i - 2];
	if (makeToken === undefined)
		return false;

	const makeS = makeToken.s.toLowerCase();
	if (makeS !== 'make' && makeS !== 'local')
		return false;

	const assignmentToken = tokens[i];
	if (assignmentToken.s !== '=')
		return false;
	
	const identifierToken = tokens[i - 1];
	if (!isIdentifier(identifierToken.s)) {
		const s = identifierToken.s;
		const ch = s[0];
		if (ch !== '"')
			return false;
	}

	return true;
}

export function removeMakeAssignmentOperators(tokens) {
	for (let i = 2; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			tokens.splice(i, 1); // remove the "=" token.
		}
	}
};