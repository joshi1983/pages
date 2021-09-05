function getGoodPrevious(token) {
	while (token.parentNode !== null)
		token = token.parentNode;
	return token;
}

export function processProcStart(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};