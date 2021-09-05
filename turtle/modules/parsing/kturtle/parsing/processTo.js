import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processTo(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.FOR &&
	previousToken.children.length === 1 &&
	previousToken.children[0].type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		const assignToken = previousToken.children[0];
		previousToken.replaceChild(assignToken, nextToken);
		nextToken.appendChild(assignToken);
	}
	else
		previousToken.appendChild(nextToken);
	return nextToken;
};