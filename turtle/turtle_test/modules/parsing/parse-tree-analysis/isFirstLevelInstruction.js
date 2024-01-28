import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonFirstLevelInstructionTypes = new Set([
ParseTreeTokenType.PROCEDURE_END_KEYWORD,
ParseTreeTokenType.PROCEDURE_START_KEYWORD
]);

const parentTypes = new Set([
ParseTreeTokenType.LIST,
ParseTreeTokenType.TREE_ROOT
]);

export function isFirstLevelInstruction(token) {
	if (token.parentNode === null || nonFirstLevelInstructionTypes.has(token.type))
		return false;
	if (!parentTypes.has(token.parentNode.type))
		return false;
	// if instruction in global scope, it should be a first level instruction.
	if (token.parentNode.type === ParseTreeTokenType.TREE_ROOT)
		return true;

	// return the truth of "token is a top level instruction in a procedure's instruction list"
	return token.parentNode.parentNode !== null &&
		token.parentNode.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
		token.parentNode.parentNode.children.indexOf(token.parentNode) === 2;
};