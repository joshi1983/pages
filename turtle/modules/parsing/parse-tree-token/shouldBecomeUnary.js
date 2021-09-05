import { Command } from
'../Command.js';
import { Operators } from
'../Operators.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPrevTypesForUnary = new Set([
	ParseTreeTokenType.TREE_ROOT
]);

export function shouldBecomeUnary(prev, next) {
	if ((next.type !== ParseTreeTokenType.BINARY_OPERATOR &&
	next.type !== ParseTreeTokenType.LEAF) ||
	!Operators.canBeUnary(next.val))
		return false;

	if (prev === null)
		return true;

	if (prev.type === ParseTreeTokenType.UNARY_OPERATOR &&
	prev.children.length === 0)
		return true;
	
	if (prev.type === ParseTreeTokenType.PARAMETERIZED_GROUP ||
	prev.type === ParseTreeTokenType.LEAF) {
		const info = Command.getCommandInfo(prev.val);
		if (info !== undefined && info.returnTypes === null) {
			return true;
		}
	}

	if (!goodPrevTypesForUnary.has(prev.type))
		return false;

	const children = prev.children;
	const last = children[children.length - 1];
	return last === undefined || last.isBracket();
};