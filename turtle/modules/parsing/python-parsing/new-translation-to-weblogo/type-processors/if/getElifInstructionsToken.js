export function getElifInstructionsToken(token) {
	const elifToken = token.children[3];
	if (elifToken === undefined)
		return;
	return elifToken.children[2];
};