import { addSelectorToken } from './addSelectorToken.js';
import { addValueTokenIfNeeded } from './addValueTokenIfNeeded.js';
import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processValueLiteral } from './processValueLiteral.js';

const badPrevTypes = new Set([
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.SEMICOLON,
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	const completeResult = isCompleteValueToken(token);
	if (completeResult === true)
		return false;
	if (badPrevTypes.has(token.type))
		return false;
	return true;
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

function shouldAddPropertyValuePair(prev) {
	if (prev.type === ParseTreeTokenType.DECLARATION_BLOCK) {
		const parent = prev.parentNode;
		if (parent !== null && parent.type === ParseTreeTokenType.AT_RULE)
			return false;
		return true;
	}
	return false;
}

export function processIdentifier(prev, next, settings) {
	prev = getGoodPrevious(prev);
	prev = addValueTokenIfNeeded(prev, next);
	if (prev === next)
		return next;
	if (prev.parentNode === null && settings !== undefined)
		prev = addSelectorToken(prev);
	if (prev.type === ParseTreeTokenType.DECLARATION && isCompleteValueToken(prev))
		prev = prev.parentNode;
	if (shouldAddPropertyValuePair(prev)) {
		const propertyPair = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.DECLARATION);
		propertyPair.appendChild(next);
		prev.appendChild(propertyPair);
		return propertyPair;
	}
	return processValueLiteral(prev, next);
};