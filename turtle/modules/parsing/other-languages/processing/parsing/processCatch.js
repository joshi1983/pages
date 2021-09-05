import { addToken } from './addToken.js';
import { isCompleteExpression } from './isCompleteExpression.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function getGoodPrevious(token) {
	while (token !== null && (token.type === ParseTreeTokenType.CATCH ||
	(token.type === ParseTreeTokenType.CODE_BLOCK && isCompleteExpression(token)))) {
		token = token.parentNode;
	}
	let lastChild = token.children[token.children.length - 1];
	if (lastChild !== undefined &&
	lastChild.type === ParseTreeTokenType.TRY)
		token = lastChild;
	lastChild = token.children[token.children.length - 1];
	if (lastChild !== undefined && lastChild.type === ParseTreeTokenType.CODE_BLOCK)
		token = lastChild;
	return token;
}

export function processCatch(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	if (previousToken.type === ParseTreeTokenType.CODE_BLOCK)
		previousToken.appendSibling(nextToken);
	else
		addToken(previousToken, nextToken);
};