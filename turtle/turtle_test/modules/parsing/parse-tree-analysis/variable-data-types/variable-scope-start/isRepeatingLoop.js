import { Command } from '../../../Command.js';
import { isLoop } from '../../isLoop.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();

export function isRepeatingLoop(token) {
	if (!isLoop(token))
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info.primaryName === 'repeat') {
		if (token.children[0].type === ParseTreeTokenType.NUMBER_LITERAL)
			return token.children[0].val > 1;
	}
	return true;
};