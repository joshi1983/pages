import { equalp } from './equalp.js';

export function memberp(needle, haystack) {
	if (haystack.indexOf(needle) !== -1)
		return true;
	if (haystack instanceof Array) {
		for (let i = 0; i < haystack.length; i++) {
			if (equalp(needle, haystack[i]))
				return true;
		}
	}
	return false;
};