import { CommandCalls } from './CommandCalls.js';

/*
Checks if the specified code might correspond with a program that draws differently based on animation time.
*/
export function mightAnimationTimeAffectDrawing(tree) {
	return CommandCalls.getCommandCalls(tree, 'animation.time').length !== 0;
};