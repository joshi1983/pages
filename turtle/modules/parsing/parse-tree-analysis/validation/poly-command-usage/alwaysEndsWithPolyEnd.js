import { Command } from '../../../Command.js';
import { getDescendentsOfType } from '../../../parse-tree-token/getDescendentsOfType.js';
import { isOutputOrStopToken } from '../../isOutputOrStopToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();
const outputNames = Command.getLowerCaseCommandNameSet(Command.getCommandInfo('output'));

export function alwaysEndsWithPolyEnd(procedure) {
	const instructionListToken = procedure.getInstructionListToken();
	if (instructionListToken.children.length === 0)
		return false;
	const tokens = getDescendentsOfType(instructionListToken, ParseTreeTokenType.PARAMETERIZED_GROUP);
	const outputStopTokens = tokens.filter(isOutputOrStopToken);
	if (outputStopTokens.some(token => outputNames.has(token.val.toLowerCase())))
		return false;
	const stopTokens = outputStopTokens;
	for (let i = 0; i < stopTokens.length; i++) {
		const stop = stopTokens[i];
		const prev = stop.previousSibling;
		if (prev === null || prev.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const info = Command.getCommandInfo(prev.val);
		if (info === undefined || info.primaryName !== 'polyEnd')
			return false;
	}
	const token = instructionListToken.children[instructionListToken.children.length - 1];
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	return info.primaryName === 'polyEnd' || info.primaryName === 'stop';
};