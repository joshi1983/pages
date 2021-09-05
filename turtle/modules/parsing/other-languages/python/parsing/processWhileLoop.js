import { getGoodPreviousForWhileLoop } from './getGoodPreviousForWhileLoop.js';

export function processWhileLoop(prev, next) {
	prev = getGoodPreviousForWhileLoop(prev);
	prev.appendChild(next);
	return next;
};