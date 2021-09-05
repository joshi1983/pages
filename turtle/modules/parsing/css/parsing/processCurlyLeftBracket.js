import { addSelectorToken } from './addSelectorToken.js';
import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { getClosestOfTypes } from '../../generic-parsing-utilities/getClosestOfTypes.js';
import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { removeDeclarationIfNeeded } from './removeDeclarationIfNeeded.js';

function isGoodPreviousIdentifier(token) {
	for (;token !== null;token = token.parentNode) {
		if (token.type === ParseTreeTokenType.SELECTOR ||
		token.type === ParseTreeTokenType.AT_RULE)
			return false;
		if (token.type === ParseTreeTokenType.DECLARATION ||
		token.type === ParseTreeTokenType.DECLARATION_BLOCK)
			return true;
	}
	return true;
}

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	const completeResult = isCompleteValueToken(token);
	if (completeResult === true)
		return false;
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return isGoodPreviousIdentifier(token);
	return true;
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

function shouldAddSelector(prev) {
	prev = getClosestOfTypes(prev, [
	ParseTreeTokenType.AT_RULE,
	ParseTreeTokenType.DECLARATION_BLOCK,
	ParseTreeTokenType.SELECTOR
	]);
	if (prev === null)
		return true;
	if (prev.type === ParseTreeTokenType.DECLARATION_BLOCK)
		return true;
	if (prev.type === ParseTreeTokenType.AT_RULE ||
	prev.type === ParseTreeTokenType.SELECTOR)
		return false;
	return false;
}

export function processCurlyLeftBracket(prev, next) {
	prev = removeDeclarationIfNeeded(prev);
	prev = getGoodPrevious(prev);
	let prevParent = prev.parentNode;
	if (prevParent !== null) {
		const decBlock = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.DECLARATION_BLOCK);
		decBlock.appendChild(next);
		if (shouldAddSelector(prev)) {
			prev = addSelectorToken(prev);
		}
		let ruleSet = getClosestOfType(prev, ParseTreeTokenType.RULE_SET);
		if (ruleSet === null)
			ruleSet = prev;
		ruleSet.appendChild(decBlock);
		return decBlock;
	}
	prev.appendChild(next);
	return prev;
};