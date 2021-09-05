import { isArgListKeyword } from './parsing/isMismatchedArgListKeyword.js';

export function shouldBecomeIdentifier(prev, next) {
	if (isArgListKeyword(prev, next))
		return true;
	return false;
};