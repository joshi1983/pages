import { isHexNumberLiteral } from './isHexNumberLiteral.js';

export function isHexToStringLiteral(s) {
	if (s[0] !== '~')
		return false;
	return isHexNumberLiteral(s.substring(1));
};