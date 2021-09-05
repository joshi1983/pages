import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isFirstLevelInstruction(token) {
	if ([ParseTreeTokenType.PROCEDURE_END_KEYWORD,
	ParseTreeTokenType.PROCEDURE_START_KEYWORD].indexOf(token.type) !== -1)
		return false;
	if (token.parentNode === null ||
	[ParseTreeTokenType.LIST, ParseTreeTokenType.TREE_ROOT].indexOf(token.parentNode.type) === -1)
		return false;
	// if instruction in global scope, it should be a first level instruction.
	if (token.parentNode.type === ParseTreeTokenType.TREE_ROOT)
		return true;

	// return the truth of "token is a top level instruction in a procedure's instruction list"
	return token.parentNode.parentNode !== null &&
		token.parentNode.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
		token.parentNode.parentNode.children.indexOf(token.parentNode) === 2;
};