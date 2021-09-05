import { isMarkingEndOfToken } from './isMarkingEndOfToken.js';
import { isStartOfKTurtleVersion } from './isStartOfKTurtleVersion.js';
import { Token } from '../../generic-parsing-utilities/Token.js';

const singleCharTokenSplitters = new Set(',/*+-^{}()'.split(''));

export function scan(code) {
	const result = [];
	let s='', lineIndex = 0, colIndex = 0;
	function pushToken() {
		if (s !== '')
			result.push(new Token(s, colIndex, lineIndex));
		s = '';
	}
	for (let i = 0; i < code.length; i++) {
		const ch = code[i];
		if (s[0] !== '#' && ch === '#') {
			// starting a comment
			pushToken();
			s = ch;
			colIndex++;
		}
		else if (ch === '"') {
			// starting or ending a string literal
			if (s[0] === '"' || s === '') {
				s += ch;
				if (s.length > 1)
					pushToken();
			}
			else {
				pushToken();
				s = ch;
			}
			colIndex++;
		}
		else if (ch === '\n') {
			// ending a line
			pushToken();
			lineIndex ++;
			colIndex = 0;
		}
		else if (s[0] === '#' || s[0] === '"') {
			// adding to a comment or string literal
			s += ch;
			colIndex++;
		}
		else if (/\s/.test(ch) === true) {
			if (s[0] === '#')
				s += ch;
			else
				pushToken();
			colIndex++;
		}
		else if (isMarkingEndOfToken(s, ch)) {
			pushToken();
			s = ch;
			colIndex++;
		}
		else if (!isStartOfKTurtleVersion(s + ch) && singleCharTokenSplitters.has(ch) &&
		(s !== '@' || ch !== '(')) {
			pushToken();
			s = ch;
			pushToken();
			colIndex++;
		}
		else {
			if (singleCharTokenSplitters.has(s))
				pushToken();
			if (s !== '' || /\s/.test(ch) === false)
				s += ch;
			colIndex++;
		}
	}
	pushToken();
	return result;
};