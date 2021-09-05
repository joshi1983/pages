import { filterAllBracketsAndCommas } from
'../helpers/filterAllBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

function isSuitableChild(token) {
	if (token.type !== ParseTreeTokenType.COMMA_EXPRESSION &&
	token.type !== ParseTreeTokenType.LIST_LITERAL)
		return false;

	const elementValueTokens = filterAllBracketsAndCommas(token.children);
	if (elementValueTokens.length !== 2)
		return false;

	if (elementValueTokens.some(e => e.children.length !== 0 ||
	e.type !== ParseTreeTokenType.IDENTIFIER))
		return false;

	return true;
}

function isDoingNothing(leftChildren, rightChildren) {
	for (let i = 0; i < leftChildren.length; i++) {
		if (leftChildren[i].val !== rightChildren[i].val)
			return false;
	}
	return true;
}

function isSwapping(leftChildren, rightChildren) {
	return leftChildren[0].val === rightChildren[1].val &&
		leftChildren[1].val === rightChildren[0].val;
}

export function processAsSwap(token, result) {
	if (token.val !== '=')
		return false;

	const children = token.children;
	if (children.length !== 2 ||
	children.some(c => !isSuitableChild(c)))
		return false;

	const leftChildren = filterAllBracketsAndCommas(children[0].children);
	const rightChildren = filterAllBracketsAndCommas(children[1].children);
	if (isDoingNothing(leftChildren, rightChildren)) {
		return true; // process by translating to nothing.
	} else if (isSwapping(leftChildren, rightChildren)) {
		result.append(`\nswap ${valueToLiteralCode(leftChildren[0].val)} ${valueToLiteralCode(leftChildren[1].val)}\n`);
		return true;
	}
	return false;
};