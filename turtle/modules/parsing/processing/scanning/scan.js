import { isCommentPrefix } from './isCommentPrefix.js';
import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { isSingleCharacterToken } from './isSingleCharacterToken.js';
import { isStartingStringLiteral } from './isStartingStringLiteral.js';
import { isTrailMarkingEndOfToken } from './isTrailMarkingEndOfToken.js';
import { sanitizeTokens } from './sanitizeTokens.js';
import { StringUtils } from '../../../StringUtils.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

export function scan(code) {
	const result = [];
	let startColIndex = 0;
	let startLineIndex = 0;
	let colIndex = 0;
	let lineIndex = 0;
	let s = '';
	function increasePosition(ch) {
		if (ch === '\n') {
			lineIndex++;
			colIndex = 0;
		}
		else
			colIndex++;
	}
	function pushToken() {
		if (s !== '') {
			let colIndex1 = colIndex;
			let lineIndex1 = lineIndex;
			if (colIndex1 > 0)
				colIndex1 --;
			result.push(new Token(s, colIndex1, lineIndex1));
			s = '';
		}
	}
	for (let i = 0; i < code.length; i++) {
		const ch = code[i];
		if (result.length > 0 && isTrailMarkingEndOfToken(result[result.length - 1].s, s, ch)) {
			pushToken();
			if (!StringUtils.isWhitespace(ch))
				s = ch;
			increasePosition(ch);
		}
		else if (isMarkingEndOfToken(s, ch)) {
			pushToken();
			if (!StringUtils.isWhitespace(ch))
				s = ch;
			increasePosition(ch);
		}
		else if (!isStartingStringLiteral(s) && !isCommentPrefix(s)) {
			if (StringUtils.isWhitespace(ch)) {
				pushToken();
				increasePosition(ch);
			}
			else if (isSingleCharacterToken(ch)) {
				pushToken();
				s = ch;
				increasePosition(ch);
				pushToken();
			}
			else {
				increasePosition(ch);
				s += ch;
			}
		}
		else {
			increasePosition(ch);
			if (!StringUtils.isWhitespace(s + ch))
				s += ch;
		}
	}
	pushToken();
	sanitizeTokens(result);
	return result;
};