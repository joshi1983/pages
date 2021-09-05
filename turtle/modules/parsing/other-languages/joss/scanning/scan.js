import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { sanitizeTokens } from './sanitizers/sanitizeTokens.js';
import { StringUtils } from
'../../../../StringUtils.js';
import { Token } from
'../../../generic-parsing-utilities/Token.js';

export function scan(code) {
	const result = [];
	let s='', lineIndex = 0, colIndex = 0;
	function pushToken() {
		if (s !== '') {
			const trailingDot = s !== '.' && s.endsWith('.');
			if (trailingDot) {
				colIndex--;
				s = s.substring(0, s.length - 1);
			}
			result.push(new Token(s, Math.max(0, colIndex - 1), lineIndex));
			if (trailingDot) {
				colIndex++;
				s = '.';
				pushToken();
				return;
			}
		}
		s = '';
	}
	for (let i = 0; i < code.length; i++) {
		const ch = code[i];
		if (isMarkingEndOfToken(s, ch)) {
			pushToken();
			s = '';
		}
		if (ch === '\n') {
			colIndex = 0;
			lineIndex++;
		}
		else {
			if (s !== '' || !StringUtils.isWhitespace(ch))
				s += ch;
			colIndex++;
		}
	}
	pushToken();

	sanitizeTokens(result);
	return result;
};