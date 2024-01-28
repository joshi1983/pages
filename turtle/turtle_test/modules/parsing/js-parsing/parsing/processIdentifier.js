import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { getGoodPreviousForIdentifier } from './getGoodPreviousForIdentifier.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processOf } from './processOf.js';
import { shouldAppendChild } from './shouldAppendChild.js';

function isExtends(previousToken, nextToken) {
	if (nextToken.val !== 'extends')
		return false;
	let t = previousToken;
	// t would be a class name token, if token is an extends used in a class definition
	if (t.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	t = t.parentNode;
	if (t.type !== ParseTreeTokenType.CLASS)
		return false;
	return true;
}

function isOf(previousToken, nextToken) {
	if (nextToken.val !== 'of')
		return false;
	const closestFor = getClosestOfType(previousToken, ParseTreeTokenType.FOR_LOOP_SETTINGS);
	return closestFor !== null;
}

export function processIdentifier(previousToken, nextToken) {
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		return nextToken;
	}
	else if (nextToken.val === 'from' && previousToken.type === ParseTreeTokenType.IMPORT) {
		nextToken.type = ParseTreeTokenType.FROM;
		previousToken.appendChild(nextToken);
	}
	else {
		if (isOf(previousToken, nextToken)) {
			nextToken.type = ParseTreeTokenType.OF;
			return processOf(previousToken, nextToken);
		}
		if (isExtends(previousToken, nextToken))
			nextToken.type = ParseTreeTokenType.EXTENDS;
		else {
			previousToken = getGoodPreviousForIdentifier(previousToken);
		}
		if (nextToken.type === ParseTreeTokenType.EXTENDS ||
		shouldAppendChild(previousToken, nextToken))
			previousToken.appendChild(nextToken);
		else
			previousToken.appendSibling(nextToken);
	}
};