import { adjustToken } from './adjustToken.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const curvedGroupTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FOR_LOOP_SETTINGS
]);

function getNearestCurvedGroupToken(token) {
	while (token.type !== ParseTreeTokenType.TREE_ROOT &&
	!(curvedGroupTypes.has(token.type) && !endsWithClosingCurvedBracket(token)))
		token = token.parentNode;
	return token;
}

export function processCurvedRightBracket(previousToken, nextToken) {
	adjustToken(previousToken);
	const closestGroupToken = getNearestCurvedGroupToken(previousToken);
	closestGroupToken.appendChild(nextToken);
	if (closestGroupToken.type !== ParseTreeTokenType.TREE_ROOT) {
		if (closestGroupToken.type === ParseTreeTokenType.ARG_LIST)
			return closestGroupToken.parentNode;
		return closestGroupToken;
	}
};