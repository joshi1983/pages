import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { sanitizeTokens } from './sanitizeTokens.js';
import { StringUtils } from
'../../../../../StringUtils.js';
import { Token } from
'../../../../generic-parsing-utilities/Token.js';

export function scan(code, sanitize) {
	const result = [];
	let token = '', colIndex = 0, lineIndex = 0;

	function pushToken() {
		if (token.trim() !== '') {
			result.push(new Token(token, Math.max(0, colIndex - 1), lineIndex));
			token = '';
		}
	}
	for (let i = 0; i < code.length; i++) {
		const nextChar = code[i];
		if (isMarkingEndOfToken(token, nextChar)) {
			pushToken();
			if (!StringUtils.isWhitespace(nextChar))
				token = nextChar;
		}
		else {
			if (token !== '' ||
			!StringUtils.isWhitespace(nextChar))
				token += nextChar;
		}
		if (nextChar === '\n') {
			lineIndex++;
			colIndex = 0;
		}
		else
			colIndex++;
	}
	pushToken();
	if (sanitize !== false)
		sanitizeTokens(result);
	return result;
};