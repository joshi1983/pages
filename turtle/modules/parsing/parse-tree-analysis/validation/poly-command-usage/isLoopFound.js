import { isLoop } from '../../isLoop.js';

export function isLoopFound(tokensBetween) {
	return tokensBetween.some(tok => isLoop(tok));
};