import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { sanitizeTokens } from './sanitizeTokens.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

const generalDelimiters = new Set(';,<>{}[]()|&'.split(''));

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
		if (token.startsWith('/*')) {
			if (ch === '\n') {
				lineIndex++;
				colIndex = 0;
			}
			else
				colIndex++;
			token += ch;
			if (token.endsWith('*/'))
				pushToken();
			continue;
		}
		else if (token.startsWith('"')) {
			token += ch;
			if (ch === '\n') {
				lineIndex++;
				colIndex = 0;
			}
			else
				colIndex++;
			if (ch === '"') {
				pushToken();
			}
			continue;
		}
		else if (ch === '\n') {
			pushToken();
			lineIndex++;
			colIndex = 0;
			continue;
		}
		else if (token.startsWith('//')) {
			token += ch;
			colIndex++;
			continue;
		}
		else if (generalDelimiters.has(ch)) {
			pushToken();
			token = ch;
			colIndex++;
			pushToken();
			continue;
		}
		else if (isMarkingEndOfToken(token, ch)) {
			pushToken();
		}
		if (token !== '' || ch.trim() !== '')
			token += ch;
		colIndex++;
	}
	pushToken();
	sanitizeTokens(result);
	return result;
};