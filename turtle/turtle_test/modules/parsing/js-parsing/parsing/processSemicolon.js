import { addToken } from './addToken.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.FOR_LOOP_SETTINGS,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	if (token.type === ParseTreeTokenType.CODE_BLOCK ||
	token.type === ParseTreeTokenType.CLASS_BODY) {
		return !endsWithCurlyRightBracket(token);
	}
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return !endsWithClosingCurvedBracket(token);
	if (token.type === ParseTreeTokenType.FOR_LOOP_SETTINGS &&
	endsWithClosingCurvedBracket(token))
		return false;
	if (token.parentNode !== null) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.CLASS_BODY)
			return true;
	}
	return goodPreviousTypes.has(token.type);
}

function isAddedToCaseOrDefaultCodeBlock(previousToken) {
	if (previousToken.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;

	return previousToken.parentNode.type === ParseTreeTokenType.CASE ||
		previousToken.parentNode.type === ParseTreeTokenType.DEFAULT;
}

function shouldAppendChildToCodeBlockOrClassBody(previousToken) {
	if ((previousToken.type === ParseTreeTokenType.CODE_BLOCK ||
	previousToken.type === ParseTreeTokenType.CLASS_BODY) && !endsWithCurlyRightBracket(previousToken))
		return true;
	return false;
}

export function processSemicolon(previousToken, nextToken) {
	while (!isGoodPrevious(previousToken))
		previousToken = previousToken.parentNode;

	if (isAddedToCaseOrDefaultCodeBlock(previousToken) || shouldAppendChildToCodeBlockOrClassBody(previousToken))
		previousToken.appendChild(nextToken);
	else
		addToken(previousToken, nextToken);
};