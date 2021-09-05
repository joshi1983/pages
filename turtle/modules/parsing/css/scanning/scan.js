import { isCommentStart } from './isCommentStart.js';
import { isCommentComplete } from './isCommentComplete.js';
import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { isQuotedStringLiteralStart } from './isQuotedStringLiteralStart.js';
import { isStringLiteralStart } from './isStringLiteralStart.js';
import { sanitizeTokens } from './sanitizeTokens.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

const singleCharTokens = new Set('{}()[];,+'.split(''));

export function scan(code) {
	const result = [];
	let token = '', colIndex = 0, lineIndex = 0;
	function pushToken() {
		if (token !== '') {
			result.push(new Token(token, colIndex, lineIndex));
			token = '';
		}
	}
	for (let i = 0; i < code.length; i++) {
		const ch = code[i];
		if (isStringLiteralStart(token)) {
			const isEscaping = token.endsWith('\\');
			if (!isEscaping && !isQuotedStringLiteralStart(token) && ch === ')') {
				colIndex--;
				pushToken();
				colIndex++;
				token = ch;
			}
			else {
				token += ch;
				if (ch === '\n') {
					colIndex = 0;
					lineIndex++;
				}
				if (isQuotedStringLiteralStart(token) && ch === token[0] && !isEscaping)
					pushToken();
			}
		}
		else if (isCommentStart(token) || isCommentStart(token + ch)) {
			token += ch;
			if (ch === '\n') {
				colIndex = 0;
				lineIndex++;
			}
			if (isCommentComplete(token))
				pushToken();
		}
		else if (singleCharTokens.has(ch)) {
			colIndex--;
			pushToken();
			colIndex++;
			token = ch;
			pushToken();
		}
		else if (ch === '\n') {
			pushToken();
			colIndex = -1;
			lineIndex++;
		}
		else if (ch.trim() === '') {
			pushToken();
		}
		else if (isMarkingEndOfToken(token, ch)) {
			colIndex--;
			pushToken();
			colIndex++;
			token = ch;
		}
		else if (ch.trim() !== '') {
			token += ch;
		}
		colIndex++;
	}
	colIndex = Math.max(0, colIndex - 1);
	pushToken();
	sanitizeTokens(result);
	return result;
};