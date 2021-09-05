import { isCommentStart } from './isCommentStart.js';
import { isCommentComplete } from './isCommentComplete.js';
import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
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
			token += ch;
			if (ch === '\n') {
				colIndex = 0;
				lineIndex++;
			}
			if (ch === token[0] && !isEscaping) {
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
			pushToken();
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
			pushToken();
			token = ch;
		}
		else if (ch.trim() !== '') {
			token += ch;
		}
		colIndex++;
	}
	pushToken();
	sanitizeTokens(result);
	return result;
};