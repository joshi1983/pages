import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { StringUtils } from '../../../StringUtils.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

export function scan(code) {
	const result = [];
	let token = '';
	let lineIndex = 0;
	let colIndex = -1;
	function pushToken() {
		if (token !== '') {
			result.push(new Token(token, colIndex, lineIndex));
			token = '';
		}
	}
	for (let i = 0; i < code.length; i++) {
		const ch = code[i];
		if (isMarkingEndOfToken(token, ch)) {
			pushToken();
		}
		if (token !== '' || !StringUtils.isWhitespace(ch))
			token += ch;
	
		if (ch === '\n') {
			lineIndex++;
			colIndex = -1;
		}
		colIndex++;
	}
	pushToken();
	return result;
};