import { assertEquals } from '../assertEquals.js';

export function compareScanTokensInfo(tokens, tokensInfo, logger) {
	if (!(tokens instanceof Array))
		throw new Error(`tokens must be an Array but found ${tokens}`);
	if (!(tokensInfo instanceof Array))
		throw new Error(`tokensInfo must be an Array but found ${tokensInfo}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but found ${logger}`);

	for (let i = 0; i < tokens.length; i++) {
		const resultToken = tokens[i];
		const token = tokensInfo[i];
		if (typeof token !== 'string' && typeof token !== 'object')
			throw new Error(`Each element of tokensInfo must be a string or object but found ${token} at index ${i}`);
		const s = typeof token === 'string' ? token : token.s;
		if (typeof s === 'string' && s !== resultToken.s)
			assertEquals(s, resultToken.s, logger);
		if (typeof token === 'object') {
			const expectedColIndex = token.colIndex;
			const expectedLineIndex = token.lineIndex;
			if (expectedColIndex !== undefined && expectedColIndex !== resultToken.colIndex)
				logger(`Expected colIndex ${expectedColIndex} but found ${resultToken.colIndex}`);
			if (expectedLineIndex !== undefined && expectedLineIndex !== resultToken.lineIndex)
				logger(`Expected lineIndex ${expectedLineIndex} but found ${resultToken.lineIndex}`);
		}
	}
};