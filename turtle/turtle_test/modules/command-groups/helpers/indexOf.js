import { equalp } from './equalp.js';

export function indexOf(needle, haystack) {
	for (let i = 0; i < haystack.length; i++) {
		if (equalp(haystack[i], needle))
			return 1 + i;
	}
	return -1; // indicate not found
};