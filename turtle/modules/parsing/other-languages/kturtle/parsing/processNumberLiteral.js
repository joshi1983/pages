import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processNumberLiteral(previousToken, nextToken, procedures) {
	if (previousToken.type === ParseTreeTokenType.COMMA)
		previousToken.appendSibling(nextToken);
	else
		previousToken.appendChild(nextToken);
	return nextToken;
};