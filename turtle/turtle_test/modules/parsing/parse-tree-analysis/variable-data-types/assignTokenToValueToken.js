import { Command } from '../../../Command.js';
import { isInstructionList } from '../../isInstructionList.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();

export function assignTokenToValueToken(assignToken) {
	if (assignToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(assignToken.val);
		if (info === undefined)
			return undefined;
		if (info.primaryName === 'localmake' || info.primaryName === 'make') {
			return assignToken.children[1];
		}
		if (info.primaryName === 'list')
			return assignToken;
	}
	if (assignToken.type === ParseTreeTokenType.LIST && !isInstructionList(assignToken))
		return assignToken;
};