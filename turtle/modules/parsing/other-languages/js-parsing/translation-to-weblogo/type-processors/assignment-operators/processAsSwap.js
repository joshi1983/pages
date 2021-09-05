import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

function isSuitableArrayLiteral(literalToken) {
	if (literalToken.type !== ParseTreeTokenType.ARRAY_LITERAL)
		return false;
	const children = literalToken.children;
	if (children.length !== 5)
		return false;
	const valueTokens = filterBracketsAndCommas(children);
	if (valueTokens.length !== 2 ||
	valueTokens.some(t => t.type !== ParseTreeTokenType.IDENTIFIER ||
	t.children.length !== 0))
		return false;

	return true;
}

// For example, [x, y] = [x, y];
function isDoingNothing(leftChildren, rightChildren) {
	const ancestor = leftChildren[0].parentNode.parentNode.parentNode;
	if (ancestor.type !== ParseTreeTokenType.TREE_ROOT &&
	ancestor.type !== ParseTreeTokenType.CODE_BLOCK)
		return false; // check if the return value from assigning is used at all.
		// if it might be used, we don't want to translate to nothing.

	for (let i = 0; i < leftChildren.length; i++) {
		if (leftChildren[i].val !== rightChildren[i].val)
			return false;
	}
	return true;
}

function isSwappingVariables(leftChildren, rightChildren) {
	return leftChildren[0].val === rightChildren[1].val &&
		leftChildren[1].val === rightChildren[0].val;
}

export function processAsSwap(token, result, options) {
	if (token.val !== '=')
		return false;

	const children = token.children;
	if (children.length !== 2 ||
	children.some(c => !isSuitableArrayLiteral(c)))
		return false;

	const leftChildren = filterBracketsAndCommas(children[0].children);
	const rightChildren = filterBracketsAndCommas(children[1].children);
	if (isDoingNothing(leftChildren, rightChildren))
		return true;
	else if (isSwappingVariables(leftChildren, rightChildren)) {
		result.append(`swap ${valueToLiteralCode(leftChildren[0].val)} ${valueToLiteralCode(leftChildren[1].val)}`);
		return true;
	}
	return false;
};