import { isREMComment } from
'../../qbasic/scanning/isREMComment.js';

export function isComment(s) {
	const ch = s[0];
	if (ch === '#')
		return true;

	return isREMComment(s);
};