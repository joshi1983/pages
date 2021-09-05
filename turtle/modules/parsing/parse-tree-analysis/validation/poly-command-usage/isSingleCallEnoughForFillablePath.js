import { Command } from '../../../Command.js';
await Command.asyncInit();

const singleNotEnoughNames = new Set(['backward', 'forward',
'jumpBackward', 'jumpForward', 'jumpIn', 'jumpLeft',
'jumpOut', 'jumpRight', 'setPos']);

export { singleNotEnoughNames };

export function isSingleCallEnoughForFillablePath(token) {
	const info = Command.getCommandInfo(token.val);
	return !singleNotEnoughNames.has(info.primaryName);
};