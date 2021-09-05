function getRoot(token) {
	while (token.parentNode !== null)
		token = token.parentNode;
	return token;
}

export function processLearn(previousToken, nextToken) {
	previousToken = getRoot(previousToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};