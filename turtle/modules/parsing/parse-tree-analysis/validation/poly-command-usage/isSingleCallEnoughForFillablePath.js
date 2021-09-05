import { Command } from '../../../Command.js';
await Command.asyncInit();

export function isSingleCallEnoughForFillablePath(token) {
	const info = Command.getCommandInfo(token.val);
	return info.primaryName !== 'forward' && info.primaryName !== 'backward';
};