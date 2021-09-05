import { Command } from '../Command.js';

export function shouldTranslateToInternalProc(token) {
	const name = token.val.toLowerCase();
	const info = Command.getCommandInfo(name);
	if (info === undefined)
		return false;
	return info.commandGroup === 'internalProc' ||
		info.internalProcArgCount === token.children.length;
};