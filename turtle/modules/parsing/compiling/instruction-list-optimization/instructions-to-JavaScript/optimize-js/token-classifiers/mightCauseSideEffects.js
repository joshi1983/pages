import { Command } from '../../../../../Command.js';
import { isCommandCall } from './isCommandCall.js';

await Command.asyncInit();

export function mightCauseSideEffects(token) {
	if (!isCommandCall(token))
		return false;
	while (token.children.length !== 0)
		token = token.children[0];
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	return (info.commandGroup === 'turtle' || info.commandGroup === 'compiled') &&
		info.isIndependentlyUseful !== false;
};