import { addToken } from './addToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function getGoodPrevious(token) {
	let lastChild = token.children[token.children.length - 1];
	if (lastChild !== undefined &&
	lastChild.type === ParseTreeTokenType.TRY)
		token = lastChild;
	lastChild = token.children[token.children.length - 1];
	if (token.type === ParseTreeTokenType.TRY && lastChild !== undefined && lastChild.type === ParseTreeTokenType.CODE_BLOCK)
		token = lastChild;
	return token;
}

export function processFinally(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	if (previousToken.type === ParseTreeTokenType.CODE_BLOCK)
		previousToken.appendSibling(nextToken);
	else
		addToken(previousToken, nextToken);
};