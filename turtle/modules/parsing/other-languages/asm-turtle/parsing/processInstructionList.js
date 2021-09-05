function getGoodPreviousToken(token) {
	while (token.parentNode !== null)
		token = token.parentNode;
	return token;
}

export function processInstructionList(previousToken, nextToken) {
	previousToken = getGoodPreviousToken(previousToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};