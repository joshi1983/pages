import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addToken } from './addToken.js';
import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processImportIfNeeded } from './processImportIfNeeded.js';

function isExpectingClassBodyToken(previousToken) {
	if (previousToken.type === ParseTreeTokenType.IDENTIFIER) {
		const prevParent = previousToken.parentNode;
		if (prevParent === null || prevParent.val === null)
			return false;
		if (prevParent.type === ParseTreeTokenType.CLASS)
			return true;
		if (prevParent.val === 'extends' && getClosestOfType(prevParent, ParseTreeTokenType.CLASS) !== null)
			return true;
		if (prevParent.val === 'implements' && prevParent.type === ParseTreeTokenType.IMPLEMENTS)
			return true;
	}
	return false;
}

function isExpectingInterfaceBodyToken(previousToken) {
	if (previousToken.type === ParseTreeTokenType.IDENTIFIER) {
		const prevParent = previousToken.parentNode;
		if (prevParent === null || prevParent.val === null)
			return false;
		if (prevParent.type === ParseTreeTokenType.INTERFACE)
			return true;
		if (prevParent.val === 'extends' && getClosestOfType(prevParent, ParseTreeTokenType.INTERFACE) !== null)
			return true;
	}
	return false;
}

export function processCurlyLeftBracket(previousToken, nextToken) {
	if (isExpectingClassBodyToken(previousToken)) {
		previousToken = getClosestOfType(previousToken, ParseTreeTokenType.CLASS);
	}
	else {
		if (isExpectingInterfaceBodyToken(previousToken)) {
			previousToken = getClosestOfType(previousToken, ParseTreeTokenType.INTERFACE);
		}
	}
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		return nextToken;
	}
	else {
		const importResult = processImportIfNeeded(previousToken, nextToken);
		if (importResult !== undefined)
			return importResult;
		let type = ParseTreeTokenType.CURLY_BRACKET_EXPRESSION;
		if (previousToken.type === ParseTreeTokenType.CLASS)
			type = ParseTreeTokenType.CLASS_BODY;
		else if (previousToken.type === ParseTreeTokenType.INTERFACE)
			type = ParseTreeTokenType.INTERFACE_BODY;
		const objToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, type);
		objToken.appendChild(nextToken);
		if (previousToken.type === ParseTreeTokenType.CLASS)
			previousToken.appendChild(objToken);
		else
			addToken(previousToken, objToken);
	}
};