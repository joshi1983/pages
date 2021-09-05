import { StringUtils } from '../../../StringUtils.js';

export function getStartingLineIndex(token) {
	const s = token.val;
	if (typeof s === 'string') {
		return token.lineIndex - StringUtils.countChar(s, '\n');
	}
	return token.lineIndex;
};