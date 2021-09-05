import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const uninterestingParentTypes = new Set([
	ParseTreeTokenType.DATA_TYPE_EXPRESSION,
	ParseTreeTokenType.FUNC,
	ParseTreeTokenType.FUNC_CALL,
	ParseTreeTokenType.IMPORT,
	ParseTreeTokenType.PACKAGE
]);

export function isPossibleVariableRead(token) {
	const parent = token.parentNode;
	if (parent === null || token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (uninterestingParentTypes.has(parent.type))
		return false;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.children.indexOf(token) === 0) {
		return false;
	}
	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY) {
		if (parent.children.indexOf(token) === 2)
			return false;
	}
	return true;
};