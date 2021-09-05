import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { getExpectedChildrenLengthForToken } from './getExpectedChildrenLengthForToken.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypesArray = [
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, // For example, {"x": 1, "y": 2}
	ParseTreeTokenType.DECLARATION,
	ParseTreeTokenType.EXTENDS,

	ParseTreeTokenType.FOR_LOOP_INSTRUCTIONS,
	ParseTreeTokenType.FOR_LOOP_SETTINGS,
	ParseTreeTokenType.IMPLEMENTS,
	ParseTreeTokenType.TREE_ROOT,
];
const goodPreviousTypes = new Set(goodPreviousTypesArray);

function isGoodPreviousToken(token) {
	// needed because some argument lists are of type CURVED_BRACKET_EXPRESSION until the => operator gets processed.
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	token.type === ParseTreeTokenType.ARG_LIST) {
		return !endsWithClosingCurvedBracket(token);
	}
	if (getExpectedChildrenLengthForToken(token) === token.children.length)
		return false;

	return goodPreviousTypes.has(token.type);
}

function getGoodPreviousToken(token) {
	while (token.parentNode !== null && !isGoodPreviousToken(token))
		token = token.parentNode;
	return token;
}

export function processComma(previousToken, nextToken) {
	previousToken = getGoodPreviousToken(previousToken);
	if (previousToken.type === ParseTreeTokenType.FOR_LOOP_SETTINGS &&
	previousToken.children.length !== 0) {
		const lastChild = previousToken.children[previousToken.children.length - 1];
		if (lastChild.type !== ParseTreeTokenType.SEMICOLON) {
			const newToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.FOR_LOOP_INSTRUCTIONS);
			let index;
			for (index = previousToken.children.length - 1; index >= 0; index--) {
				const tok = previousToken.children[index];
				if (tok.type === ParseTreeTokenType.SEMICOLON ||
				tok.type === ParseTreeTokenType.CURVED_LEFT_BRACKET ||
				tok.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
					newToken.lineIndex = tok.lineIndex;
					newToken.colIndex = tok.colIndex;
					break;
				}
			}
			index++;
			while (index < previousToken.children.length) {
				const tok = previousToken.children[index];
				tok.remove();
				newToken.appendChild(tok);
			}
			newToken.appendChild(nextToken);
			previousToken.appendChild(newToken);
			return newToken;
		}
	}
	previousToken.appendChild(nextToken);
};