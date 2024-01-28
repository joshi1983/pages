import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addToken } from './addToken.js';
import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { isCodeBlockExpected } from './isCodeBlockExpected.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isExpectingClassBodyToken(previousToken) {
	if (previousToken.type === ParseTreeTokenType.IDENTIFIER) {
		const prevPrev = previousToken.parentNode;
		if (prevPrev === null || prevPrev.val === null)
			return false;
		if (prevPrev.type === ParseTreeTokenType.CLASS)
			return true;
		if (prevPrev.val === 'extends' && getClosestOfType(prevPrev, ParseTreeTokenType.CLASS) !== null)
			return true;
	}
	return false;
}

export function processCurlyLeftBracket(previousToken, nextToken) {
	const isClassBodyToken = isExpectingClassBodyToken(previousToken);
	if (isClassBodyToken) {
		previousToken = getClosestOfType(previousToken, ParseTreeTokenType.CLASS);
	}
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		return nextToken;
	}
	else if (previousToken.val === 'import') {
		previousToken.type = ParseTreeTokenType.IMPORT;
		const objToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.CURLY_BRACKET_EXPRESSION);
		objToken.appendChild(nextToken);
		previousToken.appendChild(objToken);
	}
	else {
		let type = ParseTreeTokenType.CURLY_BRACKET_EXPRESSION;
		if (previousToken.type === ParseTreeTokenType.CLASS)
			type = ParseTreeTokenType.CLASS_BODY;
		const objToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, type);
		objToken.appendChild(nextToken);
		if (previousToken.type === ParseTreeTokenType.CLASS)
			previousToken.appendChild(objToken);
		else
			addToken(previousToken, objToken);
	}
};