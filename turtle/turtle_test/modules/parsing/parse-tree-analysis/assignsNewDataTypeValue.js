import { Command } from '../Command.js';
import { ForLoops } from './ForLoops.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

// assumes variableName is in lower case
// Even though queue, dequeue mutate the value, it doesn't change the type so this function isn't concerned with those.
export function assignsNewDataTypeValue(variableName, token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
	token.children.length === 0 ||
	typeof token.children[0].val !== 'string')
		return false;
	const commandInfo = Command.getCommandInfo(token.val);
	if (commandInfo === undefined)
		return false;
	if (ForLoops.isAForLoopToken(token)) {
		const forVarName = ForLoops.getVariableName(token);
		if (forVarName === undefined)
			return false;
		else
			return forVarName === variableName;
	}
	if (token.children[0].val.toLowerCase() !== variableName)
		return false;
	return (commandInfo.primaryName === 'localmake' ||
		commandInfo.primaryName === 'make');
};