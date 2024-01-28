import { isNumeric } from './Numbers.js';
/*
Checks if the specified string can be the start of a number in exponential format.
*/
export function isStartingENumber(s) {
	s = s.toLowerCase();
	if (s.indexOf('e') === -1)
		return false;
	return isNumeric(s + '1');
}