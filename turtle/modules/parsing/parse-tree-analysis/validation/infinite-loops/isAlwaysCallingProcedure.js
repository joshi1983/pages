import { Command } from '../../../Command.js';
import { isIfElseAlwaysCallingProcedure } from './isIfElseAlwaysCallingProcedure.js';
import { isRepeatAlwaysCallingProcedure } from './isRepeatAlwaysCallingProcedure.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();

export function isAlwaysCallingProcedure(procName, token, cachedParseTree) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		if (token.val.toLowerCase() === procName)
			return true;
		const commandInfo = Command.getCommandInfo(token.val);
		if (commandInfo !== undefined) {
			if (commandInfo.primaryName === 'ifelse')
				return isIfElseAlwaysCallingProcedure(procName, token, cachedParseTree);
			if (commandInfo.primaryName === 'repeat')
				return isRepeatAlwaysCallingProcedure(procName, token, cachedParseTree);
		}
	}
	return false;
};