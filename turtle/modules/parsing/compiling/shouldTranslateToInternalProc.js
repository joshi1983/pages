import { Command } from '../Command.js';

export function shouldTranslateToInternalProc(token) {
	const name = token.val.toLowerCase();
	const info = Command.getCommandInfo(name);
	if (info === undefined)
		return false;
	if (info.commandGroup === 'internalProc')
		return true;
	return (name === 'sort' ||
	name === 'sorted?') && token.children.length === 2;
};