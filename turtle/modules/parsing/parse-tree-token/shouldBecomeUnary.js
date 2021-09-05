import { Operators } from
'../Operators.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPrevTypesForUnary = new Set([
	ParseTreeTokenType.TREE_ROOT
]);

export function shouldBecomeUnary(prev, next) {
	if (next.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	!Operators.canBeUnary(next.val))
		return false;
	if (prev === null)
		return true;

	if (!goodPrevTypesForUnary.has(prev.type))
		return false;

	const children = prev.children;
	const last = children[children.length - 1];
	return last === undefined || last.isBracket();
};