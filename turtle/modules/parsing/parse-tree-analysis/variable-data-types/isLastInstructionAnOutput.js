import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();

export function isLastInstructionAnOutput_(instructionListToken) {
	const topInstructionTokens = instructionListToken.children.filter(t => t.type !== ParseTreeTokenType.LEAF);
	const lastToken = topInstructionTokens[topInstructionTokens.length - 1];
	if (lastToken === undefined || lastToken.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(lastToken.val);
	if (info === undefined)
		return false;
	if (info.primaryName === 'output')
		return true;
	const instructionListArgs = info.args.filter(a => a.types === 'instructionlist');
	if (instructionListArgs.length === 0)
		return false;

	// if any instruction list within the last node does not always end with an output, return false.
	for (let i = 0; i < info.args.length; i++) {
		const arg = info.args[i];
		if (arg.types === 'instructionlist') {
			if (i >= lastToken.children.length || !isLastInstructionAnOutput_(lastToken.children[i]))
				return false;
		}
	}
	return true;
};

export function isLastInstructionAnOutput(procedure) {
	// Check if the last instruction token to execute is an output.
	const instructionListToken = procedure.getInstructionListToken();
	if (instructionListToken === undefined)
		return false;
	else
		return isLastInstructionAnOutput_(instructionListToken);
};