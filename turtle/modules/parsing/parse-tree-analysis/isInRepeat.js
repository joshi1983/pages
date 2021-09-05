import { getNearestRepeat } from './getNearestRepeat.js';

export function isInRepeat(token) {
	return getNearestRepeat(token) !== undefined;
};