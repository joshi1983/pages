import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { declaringTypes } from './declaringTypes.js';
import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { getGoodPreviousForIdentifier } from './getGoodPreviousForIdentifier.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processImportIfNeeded } from './processImportIfNeeded.js';
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

function shouldSetPreviousParentCodeBlock(previousToken) {
	const parent = previousToken.parentNode;
	if (parent === null ||
	parent.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return false;
	if (parent.children.length > 1) {
		const secondChild = parent.children[1];
		if (secondChild.type === ParseTreeTokenType.COLON)
			return false;
	}
	if (declaringTypes.has(previousToken.type))
		return true;
	return false;
}

function getPreliminaryGoodPrevious(previousToken) {
	if (previousToken.type === ParseTreeTokenType.IDENTIFIER &&
	previousToken.children.length === 0) {
		const parent = previousToken.parentNode;
		if (parent.children.length === 2 &&
		parent.val === 'as' && parent.type === ParseTreeTokenType.BINARY_OPERATOR) {
			const grandParent = parent.parentNode;
			if (grandParent.type === ParseTreeTokenType.EXPORT)
				return grandParent;
		}
	}
	return previousToken;
}

export function processIdentifier(previousToken, nextToken) {
	previousToken = getPreliminaryGoodPrevious(previousToken);
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		return nextToken;
	}
	else if (nextToken.val === 'from' && (previousToken.type === ParseTreeTokenType.IMPORT ||
	previousToken.type === ParseTreeTokenType.EXPORT)) {
		nextToken.type = ParseTreeTokenType.FROM;
		previousToken.appendChild(nextToken);
	}
	else {
		const importResult = processImportIfNeeded(previousToken, nextToken);
		if (importResult !== undefined)
			return importResult;

		if (isOf(previousToken, nextToken)) {
			nextToken.type = ParseTreeTokenType.OF;
			return processOf(previousToken, nextToken);
		}
		if (isExtends(previousToken, nextToken))
			nextToken.type = ParseTreeTokenType.EXTENDS;
		else {
			previousToken = getGoodPreviousForIdentifier(previousToken);
		}
		if (shouldSetPreviousParentCodeBlock(previousToken))
			previousToken.parentNode.type = ParseTreeTokenType.CODE_BLOCK;
		if (nextToken.type === ParseTreeTokenType.EXTENDS ||
		shouldAppendChild(previousToken, nextToken))
			previousToken.appendChild(nextToken);
		else
			previousToken.appendSibling(nextToken);
	}
};