import { Command } from '../../../../../parsing/Command.js';
import { isInstructionList } from '../../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

export function isLikelyInstructionList(token) {
	if (isInstructionList(token))
		return true;
	if (token.type !== ParseTreeTokenType.LIST)
		return false;
	for (const child of token.children) {
		if (child.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const commandInfo = Command.getCommandInfo(child.val);
			if (commandInfo !== undefined && commandInfo.returnTypes === null)
				return true;
		}
	}
	return false;
};