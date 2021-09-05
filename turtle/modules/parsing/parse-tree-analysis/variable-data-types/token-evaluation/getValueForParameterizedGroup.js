import { Command } from '../../../Command.js';
import { getCommandGroups } from '../../../../command-groups/getCommandGroups.js';
import { getSpecialCommandResult, isSpecialCommand } from './getSpecialCommandResult.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();

const commandGroups = getCommandGroups(undefined);

export function getValueForParameterizedGroup(token, tokenValueMap) {
	const info = Command.getCommandInfo(token.val);
	if (info !== undefined) {
		if (isSpecialCommand(info))
			return getSpecialCommandResult(info, token, tokenValueMap);
		const argCount = Command.getArgCount(info);
		if ((token.parentNode.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION || !argCount.isFlexible) &&
		token.children.length !== argCount.defaultCount)
			return; // don't continue when argument count is invalid.
		const argValues = [];
		for (let i = 0; i < token.children.length; i++) {
			const child = token.children[i];
			const val = tokenValueMap.get(child);
			if (val !== undefined && val !== null)
				argValues.push(val);
			else
				break;
		}
		if (argValues.length === token.children.length) {
			try {
				return commandGroups.get(info.commandGroup)[info.primaryName](...argValues);
			}
			catch (e) {
				// If an error is thrown trying to evaluate, just ignore it.
			}
		}
	}
};