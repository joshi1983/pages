import { CommandCalls } from './CommandCalls.js';

export function isUsingAnimationTime(tree) {
	return CommandCalls.getCommandCalls(tree, 'animation.time').length !== 0;
};