import { isHexNumberLiteralStart } from '../scanning/isHexNumberLiteralStart.js';
import { isOctalNumberLiteralStart } from '../scanning/isOctalNumberLiteralStart.js';

export function evaluateNumberLiteralString(s) {
	if (isHexNumberLiteralStart(s)) {
		if (s[0] === '#')
			return parseInt(s.substring(1), 16);
		return parseInt(s.substring(2), 16);
	}
	if (isOctalNumberLiteralStart(s))
		return parseInt(s.substring(2), 8);

	return parseFloat(s);
};