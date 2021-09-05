import { assertEquals } from '../assertEquals.js';

export function compareScanTokens(tokenInfo, resToken, logger) {
	let s;
	if (typeof tokenInfo === 'string')
		s = tokenInfo;
	else {
		s = tokenInfo.s;
		if (tokenInfo.colIndex !== undefined &&
		tokenInfo.colIndex !== resToken.colIndex) {
			logger(`Expected colIndex to be ${tokenInfo.colIndex} but found ${resToken.colIndex}`);
		}
		if (tokenInfo.lineIndex !== undefined &&
		tokenInfo.lineIndex !== resToken.lineIndex) {
			logger(`Expected lineIndex to be ${tokenInfo.lineIndex} but found ${resToken.lineIndex}`);
		}
	}
	if (s !== undefined) {
		if (resToken.s !== s)
			assertEquals(s, resToken.s, logger);
	}
};
