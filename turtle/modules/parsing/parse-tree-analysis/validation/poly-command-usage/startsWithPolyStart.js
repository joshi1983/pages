import { Command } from '../../../Command.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();

export function startsWithPolyStart(procedure) {
	const instructionListToken = procedure.getInstructionListToken();
	const firstToken = instructionListToken.children[0];
	if (firstToken === undefined || firstToken.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(firstToken.val);
	if (info === undefined)
		return false;
	return info.primaryName === 'polyStart';
};