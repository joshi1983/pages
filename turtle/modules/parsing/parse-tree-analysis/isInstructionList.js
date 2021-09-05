import { Command } from '../Command.js';
import { ForLoops } from './ForLoops.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isIfElseInstructionList(token) {
	const index = token.parentNode.children.indexOf(token);
	if (index < 1)
		return false;
	return isInstructionList(token.parentNode.parentNode);
}

export function isInstructionList(token) {
	if (token.type === ParseTreeTokenType.TREE_ROOT)
		return true;
	if (token.type === ParseTreeTokenType.LIST && token.parentNode !== null) {
		if (ParseTreeTokenType.PROCEDURE_START_KEYWORD === token.parentNode.type)
			return token.parentNode.children.indexOf(token) === 2;

		// Don't consider the for-loop control settings list to be an instruction list.
		// It isn't intended to run things like "fd 100".  It is more of a data-list.
		if (ForLoops.isAForLoopToken(token.parentNode) && token.parentNode.children.indexOf(token) === 0)
			return false;
		if (token.parentNode.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const info = Command.getCommandInfo(token.parentNode.val);
			// if token's parent is a recognized command, see if the corresponding argument is an "instructionlist".
			if (info === undefined)
				return false; // procedures don't take instruction lists as parameters.
			else if (info.primaryName === 'ifelse')
				return isIfElseInstructionList(token);
			else {
				return Command.getParameterTypes(info, token.parentNode.children.indexOf(token)) === 'instructionlist';
			}
		}
	}
	return false;
};