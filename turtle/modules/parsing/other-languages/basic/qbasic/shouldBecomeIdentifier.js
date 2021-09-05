import { isArgListKeyword } from './parsing/isArgListKeyword.js';

export function shouldBecomeIdentifier(prev, next) {
	if (isArgListKeyword(prev, next))
		return true;
	return false;
};