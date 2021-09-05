import { ParseTreeToken } from '../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../parsing/ParseTreeTokenType.js';
import { singleTokenToString } from '../../parsing/parseTreeToCodeWithComments.js';

/*
Finds the source string that corresponds with the specified parse token.
For certain types of tokens, it is impossible to determine the source string purely from those tokens.
For example, "7" and "7." will parse to the exact same token so reversing the process is ambiguous.
This function looks at the original code to solve this ambiguity.
*/
export function getStringSourceForToken(parseToken, endingIndex, originalCode) {
	if (!(parseToken instanceof ParseTreeToken))
		throw new Error('parseToken must be a ParseTreeToken');
	if (typeof endingIndex !== 'number')
		throw new Error('endingIndex must be a number');
	if (typeof originalCode !== 'string')
		throw new Error('originalCode must be a string');

	let s = singleTokenToString(parseToken);
	if (parseToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
		let len = s.length;
		for (let i = 0; i <= endingIndex; i++) {
			let c = originalCode.charAt(endingIndex - i);
			if (c !== '.' && c !== '0')
				break;
			if (c !== s.charAt(len - i - 1)) {
				// insert.
				s = s.substring(0, len - i) + c + s.substring(len - i);
				len++;
			}
		}
		for (let i = endingIndex - s.length; i >= 0; i--) {
			let c = originalCode.charAt(i);
			if (c === '0')
				s = '0' + s;
			else
				break;
		}
	}
	return originalCode.substring(endingIndex - s.length + 1, endingIndex + 1);
};