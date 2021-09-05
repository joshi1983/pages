import { isREMComment } from './isREMComment.js';

export function isComment(s) {
	if (s[0] === "'")
		return true;
	return isREMComment(s);
};