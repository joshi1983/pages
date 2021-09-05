import { Token } from '../../generic-parsing-utilities/Token.js';

const singleCharTokens = new Set(':,'.split(''));

export function scan(code) {
	let token = '';
	let lineIndex = 0;
	let colIndex = 0;
	const result = [];
	function pushToken() {
		if (token !== '') {
			result.push(new Token(token, colIndex, lineIndex));
			token = '';
		}
	}
	for (let i = 0; i < code.length; i++) {
		const ch = code[i];
		if (token.startsWith('//') && ch !== '\n') {
			token += ch;
		}
		else {
			if (ch.trim() === '') {
				pushToken();
			}
			else if (singleCharTokens.has(ch)) {
				pushToken();
				token = ch;
				colIndex++;
				pushToken();
				continue; // skip the colIndex increment at the bottom.
			}
			else {
				token += ch;
			}
		}
		if (ch === '\n') {
			lineIndex++;
			colIndex = 0;
		}
		else
			colIndex++;
	}
	pushToken();
	return result;
};