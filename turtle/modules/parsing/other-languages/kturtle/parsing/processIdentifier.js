import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processIdentifier(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.LEARN &&
	previousToken.children.length === 0)
		previousToken.appendChild(nextToken);
	else {
		nextToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		previousToken.appendChild(nextToken);
	}
	return nextToken;
};