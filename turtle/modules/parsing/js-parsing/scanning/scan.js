import { isCommentPrefix } from './isCommentPrefix.js';
import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { isSingleCharacterToken } from './isSingleCharacterToken.js';
import { isStartingNumberLiteral } from './isStartingNumberLiteral.js';
import { isStartingRegularExpression } from './isStartingRegularExpression.js';
import { isStartingStringLiteral } from './isStartingStringLiteral.js';
import { isStartingTemplateLiteral } from './isStartingTemplateLiteral.js';
import { isTrailMarkingEndOfToken } from './isTrailMarkingEndOfToken.js';
import { isWhitespace } from './isWhitespace.js';
import { sanitizeTokens } from './sanitizeTokens.js';
import { scanFinalTokenString } from './scanFinalTokenString.js';
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
		const preColIndex = colIndex;
		const preLineIndex = lineIndex;
		if (result.length > 0 && isTrailMarkingEndOfToken(result[result.length - 1].s, s, ch)) {
			pushToken();
			if (!isWhitespace(ch))
				s = ch;
			increasePosition(ch);
		}
		else if (isMarkingEndOfToken(s, ch)) {
			pushToken();
			if (!isWhitespace(ch))
				s = ch;
			increasePosition(ch);
		}
		else if (!isStartingStringLiteral(s) && !isCommentPrefix(s) && !isStartingTemplateLiteral(s) && !isStartingRegularExpression(s)) {
			if (isWhitespace(ch)) {
				pushToken();
				increasePosition(ch);
			}
			else if (isSingleCharacterToken(ch) && !isStartingNumberLiteral(s)) {
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
			if (!isWhitespace(s + ch))
				s += ch;
		}
		if (s.length === 1) {
			startColIndex = preColIndex;
			startLineIndex = preLineIndex;
		}
	}
	result.push(...scanFinalTokenString(s, startColIndex, startLineIndex));
	sanitizeTokens(result);
	return result;
};