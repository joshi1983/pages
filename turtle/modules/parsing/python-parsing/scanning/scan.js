import { isBytesLiteralStart } from './isBytesLiteralStart.js'; 
import { isCompleteIndent } from './isCompleteIndent.js';
import { isEscapedLineBreak } from './isEscapedLineBreak.js';
import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { isStartOfDocString } from './isStartOfDocString.js';
import { StringUtils } from
'../../../StringUtils.js';
import { Token } from
'../../generic-parsing-utilities/Token.js';

function isIgnorableWhitespace(s) {
	return s.trim() === '' && !isCompleteIndent(s);
}

export function scan(code) {
	const result = [];
	let colIndex = 0, lineIndex = 0;
	let token = '';
	function pushToken() {
		if (isIgnorableWhitespace(token))
			token = '';
		else {
			result.push(new Token(token, colIndex, lineIndex));
			token = '';
		}
	}
	
	for (let i = 0; i < code.length; i++) {
		let ch = code[i];
		
		if (ch === '#') {
			pushToken();
			for (; i < code.length && code[i] !== '\n'; i++) {
				token += code[i];
				colIndex++;
			}
			pushToken();
			ch = code[i];
		}
		else if (isStartOfDocString(code, i)) {
			pushToken();
			const beginEndMarker = code.substring(i, i+3);
			const endIndex = code.indexOf(beginEndMarker, i + 3);
			if (endIndex === -1) {
				token = code.substring(i);
				token += beginEndMarker;
				i = code.length;
			}
			else {
				token = code.substring(i, endIndex + 3);
				i = endIndex + 2;
			}
			const numLines = StringUtils.countChar(token, '\n');
			if (numLines !== 0) {
				lineIndex += numLines;
				colIndex = token.length - token.lastIndexOf('\n');
			}
			pushToken();
			continue;
		}
		else if (!isBytesLiteralStart(token) && (ch === '"' || ch === '\'')) {
			pushToken();
			token += ch;
			colIndex++;
			let isEscaping = false;
			for (i++; i < code.length; i++) {
				if (!isEscaping) {
					if (code[i] === ch)
						break;
					else if (code[i] === '\\')
						isEscaping = true;
				}
				else
					isEscaping = false;
				token += code[i];
				colIndex++;
				if (code[i] === '\n') {
					// weird case.  Illegal Python string literal but
					// lets forge through anyway as if this was a mutliline string literal.
					colIndex = 0;
					lineIndex++;
				}
			}
			token+= ch;
			pushToken();
			continue;
		}
		else if (isEscapedLineBreak(token + ch)) {
			token += ch;
			pushToken();
			lineIndex++;
			colIndex = 0;
			continue;
		}
		else if (isMarkingEndOfToken(token, ch)) {
			colIndex--;
			pushToken();
			if (ch === '\t' || ch === ' ' || !/\s/.test(ch))
				token = ch;
			colIndex+=2;
			if (ch === '\n') {
				lineIndex++;
				colIndex = 0;
			}
			continue;
		}
		if (token !== '\\' && token !== '\\\r' && ch === '\n') {
			pushToken();
			colIndex = 0;
			lineIndex++;
		}
		else {
			colIndex++;
			if (ch !== undefined)
				token += ch;
		}
	}
	pushToken();
	
	return result;
};