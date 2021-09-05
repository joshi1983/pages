import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const assignmentParentTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.TREE_ROOT
]);
const possibleAssignmentVals = new Set(['=']);

export function shouldBecomeAssignment(operatorToken) {
	if (operatorToken.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	!possibleAssignmentVals.has(operatorToken.val))
		return false;
	const parent = operatorToken.parentNode;
	if (parent === null | !assignmentParentTypes.has(parent.type))
		return false;
	return true;
};