import { Command } from '../../Command.js';
import { isInstructionList } from '../isInstructionList.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { Procedure } from '../../Procedure.js';
await Command.asyncInit();

const neverEvaluatedTypes = new Set([
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.LEAF,
	ParseTreeTokenType.PROCEDURE_START_KEYWORD,
	ParseTreeTokenType.PROCEDURE_END_KEYWORD,
	ParseTreeTokenType.COMMENT,
	ParseTreeTokenType.NEW_LINE
]);

// Determine if the specified token has any hope of being evaluated.
// This decision helps reduce the size of data being evaluated so the process gets faster.
export function shouldBeEvaluatedAdvanced(token) {
	if (neverEvaluatedTypes.has(token.type))
		return false;

	if (Procedure.isParameterToken(token))
		return false;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info === undefined || (info.isStaticEvaluationSafe !== true && info.returnTypes !== null))
			return false;
	}
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION && token.children.length > 3)
		return false; // weird case but the parse tree could have code quality problems like this.
	if (isInstructionList(token))
		return false;

	return true;
}