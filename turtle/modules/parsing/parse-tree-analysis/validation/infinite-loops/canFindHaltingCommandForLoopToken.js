import { Command } from '../../../Command.js';
import { CommandCalls } from '../../CommandCalls.js';
import { getDescendentsOfType } from '../../../parse-tree-token/getDescendentsOfType.js';
import { getNearestLoopAncestor } from '../../getNearestLoopAncestor.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function canFindHaltingCommandForLoopToken(loopToken) {
	const descendents = CommandCalls.filterCommandCalls(
		getDescendentsOfType(loopToken, ParseTreeTokenType.PARAMETERIZED_GROUP),
		['break', 'output', 'stop']);
	for (let i = 0; i < descendents.length; i++) {
		const token = descendents[i];
		const info = Command.getCommandInfo(token.val);
		if (info.primaryName === 'stop' || info.primaryName === 'output')
			return true;
		else {
			const nearestLoopToken = getNearestLoopAncestor(token);
			if (nearestLoopToken === loopToken)
				return true;
		}
	}
	return false;
};