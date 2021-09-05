import { addDeclaration } from './addDeclaration.js';
import { addToken } from './addToken.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldBecomeDeclaration } from './shouldBecomeDeclaration.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CLASS_BODY,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.FOR_LOOP_SETTINGS,
	ParseTreeTokenType.INTERFACE_BODY,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	if (token.type === ParseTreeTokenType.DECLARATION)
		return false;
	if (token.type === ParseTreeTokenType.CODE_BLOCK ||
	token.type === ParseTreeTokenType.CLASS_BODY ||
	token.type === ParseTreeTokenType.INTERFACE_BODY ||
	token.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION) {
		return !endsWithCurlyRightBracket(token);
	}
	if (token.type === ParseTreeTokenType.FOR &&
	token.children.length === 0)
		return true;
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
	if (shouldBecomeDeclaration(previousToken)) {
		const declaration = addDeclaration(previousToken);
		return addToken(declaration.parentNode, nextToken);
	}
	if (previousToken.type === ParseTreeTokenType.FOR &&
	previousToken.children.length === 0) {
		// recover a bit from an erroneous ; immediately after a for.
		const forLoopSettings = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.FOR_LOOP_SETTINGS);
		previousToken.appendChild(forLoopSettings);
		previousToken = forLoopSettings;
	}

	if (isAddedToCaseOrDefaultCodeBlock(previousToken) || shouldAppendChildToCodeBlockOrClassBody(previousToken)) {
		previousToken.appendChild(nextToken);
	}
	else
		addToken(previousToken, nextToken);

	const token = nextToken.parentNode;
	if (token.type === ParseTreeTokenType.CODE_BLOCK &&
	token.children.length !== 0 &&
	token.children[0].type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
		return token;
};