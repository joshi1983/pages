import { getTokenParts } from './getTokenParts.js';
import { isCommentStart } from './isCommentStart.js';
import { isCompleteArrow } from './isCompleteArrow.js';
import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { StringUtils } from '../../../../StringUtils.js';
import { Token } from '../../../Token.js';

export function scan(s) {
	const result = [];
	let token = '';
	let colIndex = -1, lineIndex = 0;
	let oneCharacterIdentifiers = false;
	function pushToken() {
		if (token !== '') {
			const parts = getTokenParts(token);
			let partColIndex = colIndex - token.length;
			for (const part of parts) {
				partColIndex += part.length;
				result.push(new Token(part, colIndex, lineIndex));
				if (part === '=' || isCompleteArrow(part))
					oneCharacterIdentifiers = true;
			}
			token = '';
		}
	}
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (isMarkingEndOfToken(token, ch, oneCharacterIdentifiers))
			pushToken();
		if (isCommentStart(token)) {
			token += ch;
		}
		else {
			if (!StringUtils.isWhitespace(ch))
				token += ch;
		}
		if (ch === '\n') {
			lineIndex++;
			colIndex = -1;
			oneCharacterIdentifiers = false;
		}
		else
			colIndex++;
	}
	pushToken();
	return result;
};