import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processStringLiteral(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.COMMA)
		previousToken.appendSibling(nextToken);
	else
		previousToken.appendChild(nextToken);
	return nextToken;
};