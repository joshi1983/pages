import { addToken } from './addToken.js';
import { endsWithSquareRightBracket } from './endsWithSquareRightBracket.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const squareGroupTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.INDEX_EXPRESSION
]);

function getClosestGroupNeedingToClose(token) {
	while (token !== null &&
	token.type !== ParseTreeTokenType.TREE_ROOT &&
	(!squareGroupTypes.has(token.type) || endsWithSquareRightBracket(token)))
		token = token.parentNode;
	return token;
}

export function processSquareRightBracket(previousToken, nextToken) {
	const squareGroupToken = getClosestGroupNeedingToClose(previousToken);
	if (squareGroupToken === null)
		addToken(previousToken, nextToken);
	else {
		squareGroupToken.appendChild(nextToken);
		if (squareGroupToken.type !== ParseTreeTokenType.TREE_ROOT)
			return squareGroupToken;
	}
};