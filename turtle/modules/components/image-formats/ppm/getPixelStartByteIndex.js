import { StringUtils } from
'../../../StringUtils.js';

export function getPixelStartByteIndex(s) {
	if (typeof s !== 'string')
		throw new Error(`s must be a string but found ${s}`);

	s = s.trim();
	let consumeCount = 0;
	let result3;
	for (let i = 0; i < s.length; i++) {
		let ch = s[i];
		if (ch === '#') {
			// scan through commented line.
			while (i < s.length && ch !== '\n') {
				i++;
				ch = s[i];
			}
			while (StringUtils.isWhitespace(s[i + 1])) {
				i++;
			}
		}
		else if (StringUtils.isWhitespace(ch)) {
			consumeCount++;
			if (consumeCount === 3) {
				result3 = i;
			}
			else if (consumeCount === 4 && s[i] === '\n') {
				return i + 2;
			}
			while (StringUtils.isWhitespace(s[i + 1])) {
				if (consumeCount === 4 && s[i + 1] === '\n') {
					return i + 2;
				}
				i++;
			}
			if (consumeCount === 4)
				break;
		}
	}
	return result3 + 2;
};