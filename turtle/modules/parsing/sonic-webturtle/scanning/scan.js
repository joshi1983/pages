import { isComment } from './isComment.js';
import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { isStringLiteral } from './isStringLiteral.js';
import { splitTokens } from './splitTokens.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

export function scan(code) {
	let lineIndex = 0;
	let colIndex = 0;
	let token = '';
	let result = [];
	function pushToken() {
		if (token !== '') {
			if (token.length > 1 && '+-'.indexOf(token[0]) !== -1 &&
			/\d/.test(token[1]) === false) {
				// Separate the + or - out to a different token.
				result.push(new Token(token[0], colIndex - token.length + 1, lineIndex));
				token = token.substring(1);
			}
			result.push(new Token(token, colIndex, lineIndex));
			if (isStringLiteral(result, result.length - 1, token))
				result[result.length - 1].isStringLiteral = true;
			token = '';
		}
	}
	for (let i = 0; i < code.length; i++) {
		const ch = code[i];
		if (ch === '\n') {
			pushToken();
			lineIndex++;
			colIndex = -1; // -1 but this will be incremented to 0 at the end.
		}
		else if (isComment(token) || isStringLiteral(result, result.length, token)) {
			token += ch;
		}
		else if (ch.trim() === '') {
			pushToken();
		}
		else if ('*/'.indexOf(ch) !== -1) {
			pushToken();
			token = ch;
			pushToken();
		}
		else {
			if (isMarkingEndOfToken(token, ch))
				pushToken();
			token += ch;
		}
		colIndex++;
	}
	pushToken();
	splitTokens(result);
	return result;
};