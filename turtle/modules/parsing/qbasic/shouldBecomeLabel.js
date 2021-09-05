import { getLastDescendentTokenOf } from
'../generic-parsing-utilities/getLastDescendentTokenOf.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

const typesNotExpectingNumbers = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

function mightExpectNumber(prev) {
	if (prev.type === ParseTreeTokenType.ARG_LIST) {
		const prevChildren = prev.children;
		const lastChild = prevChildren[prevChildren.length - 1];
		if (lastChild.type === ParseTreeTokenType.NUMBER_LITERAL ||
		lastChild.type === ParseTreeTokenType.STRING_LITERAL)
			return false;
	}
	if (typesNotExpectingNumbers.has(prev.type))
		return false;
	return true;
}

export function shouldBecomeLabel(prev, current, nextScanToken) {
	if (current.type !== ParseTreeTokenType.NUMBER_LITERAL &&
	current.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (current.type !== ParseTreeTokenType.NUMBER_LITERAL &&
	(nextScanToken === undefined || nextScanToken.s !== ':'))
		return false;
	if (prev.lineIndex === current.lineIndex &&
	prev.type !== ParseTreeTokenType.TREE_ROOT)
		return false;
	const lastDescendent = getLastDescendentTokenOf(prev);
	if (lastDescendent.lineIndex === current.lineIndex &&
	lastDescendent.type !== ParseTreeTokenType.TREE_ROOT)
		return false;
	if (current.type === ParseTreeTokenType.NUMBER_LITERAL &&
	mightExpectNumber(prev))
		return false;
	return true;
};