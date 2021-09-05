import { isComment } from './isComment.js';
import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { isStringLiteral } from './isStringLiteral.js';
import { splitSpecialTokens } from './splitSpecialTokens.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

const generalDelimiters = new Set(';,{}[]()|+*:'.split(''));

export function scan(code) {
	const result = [];
	let token = '';
	let lineIndex = 0;
	let colIndex = 0;
	function pushToken() {
		if (token !== '') {
			result.push(new Token(token, colIndex, lineIndex));
			token = '';
		}
	}
	for (let i = 0; i < code.length; i++) {
		const ch = code[i];
		if (isStringLiteral(token)) {
			if (ch === '\n') {
				colIndex--;
				pushToken();
				lineIndex++;
				colIndex = 0;
				continue;
			}
			token += ch;
			if (isStringLiteral(ch)) {
				pushToken();
			}
		}
		else if (isComment(token + ch)) {
			if (ch === '\n')
				pushToken();
			else
				token += ch;
		}
		else if (isMarkingEndOfToken(token, ch)) {
			colIndex--;
			pushToken();
			colIndex++;
			token = ch.trim();
		}
		else if (ch.trim() === '')
			pushToken();
		else if (generalDelimiters.has(ch)) {
			pushToken();
			token = ch;
			pushToken();
		}
		else if (token !== '' || ch.trim() !== '')
			token += ch;
		if (generalDelimiters.has(token))
			pushToken();
		if (ch === '\n') {
			lineIndex++;
			colIndex = 0;
		}
		else
			colIndex++;
	}
	colIndex = Math.max(0, colIndex - 1);
	pushToken();
	splitSpecialTokens(result);
	return result;
};