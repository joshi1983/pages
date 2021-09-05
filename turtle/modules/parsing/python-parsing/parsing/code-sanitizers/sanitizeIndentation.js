import { binarySearch } from
'../../../../binarySearch.js';
import { scan } from '../../scanning/scan.js';
import { Token } from '../../../generic-parsing-utilities/Token.js';

function lineToPrefix(line) {
	const s = line.trim();
	const prefixEndIndex = line.indexOf(s);
	if (prefixEndIndex <= 0)
		return '';
	const prefix = line.substring(0, prefixEndIndex);
	return prefix;
}

function lineMightNeedFixing(line) {
	const prefix = lineToPrefix(line);
	if (prefix === '')
		return false;
	return prefixMightNeedFixing(prefix);
}

function prefixMightNeedFixing(s) {
	if (typeof s !== 'string')
		throw new Error(`s must be a string but found s=${s}`);

	if (s.indexOf(' ') === -1)
		return false;
	let spaceCount = 0;
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (ch === ' ')
			spaceCount++;
		else {
			if (spaceCount % 4 !== 0)
				return true;
			spaceCount = 0;
		}
	}
	return spaceCount % 4 !== 0;
}

function replaceWhitespaces(prefix, indentChar) {
	let spaceCount = 0;
	for (const ch of prefix) {
		if (ch === '\t')
			spaceCount += 4;
		else
			spaceCount++;
	}
	if (indentChar === '\t')
		return indentChar.repeat(Math.floor(spaceCount / 4));
	else
		return indentChar.repeat(spaceCount);
}

function indentationBinarySearch(lineIndex, tokens) {
	return binarySearch(tokens, function(target, token) {
		if (token.lineIndex < target.lineIndex)
			return 1;
		else if (token.lineIndex > target.lineIndex)
			return -1;
		else if (token.s.trim() === '')
			return 1;
		else
			return 0;
	}, {'lineIndex': lineIndex});
}

// checks if the previous line ends with a :.  That would indicate 1 more indent than previous line.
function shouldAddIndent(lineIndex, tokens, lastIndexIndented) {
	const startInfo = indentationBinarySearch(lineIndex, tokens);
	if (typeof startInfo === 'object')
		return false;

	let scanTokenIndex = startInfo;
	let numIndentsAtLine = 0;
	let numIndentsAtPreviousLine = 0;
	for (scanTokenIndex--; scanTokenIndex >= 0 ; scanTokenIndex-- ) {
		const token = tokens[scanTokenIndex];
		if (token.lineIndex !== lineIndex)
			break;
		if (token.s.trim() === '')
			numIndentsAtLine++;
		else
			numIndentsAtLine = 0;
	}
	let prevLineIndex;
	let scanTokenIndexEndOfPreviousLine;
	for (;scanTokenIndex >= 0; scanTokenIndex--) {
		const token = tokens[scanTokenIndex];
		if (token.s.trim() === '')
			numIndentsAtPreviousLine++;
		else {
			if (prevLineIndex === undefined) {
				prevLineIndex = token.lineIndex;
				scanTokenIndexEndOfPreviousLine = scanTokenIndex;
			}
			else if (prevLineIndex !== token.lineIndex) {
				break;
			}
			numIndentsAtPreviousLine = 0;
		}
	}
	if (prevLineIndex === undefined)
		return false; // the current line should not be indented more.
		// the current line should have no indentation.

	if (scanTokenIndexEndOfPreviousLine === undefined)
		return false;

	if (numIndentsAtLine > numIndentsAtPreviousLine)
		return false;

	const token = tokens[scanTokenIndexEndOfPreviousLine];
	if (token.s === ':')
		return true;

	const prevLineToken = tokens[prevLineIndex];
	const lastIndentedToken = tokens[lastIndexIndented];
	if (prevLineToken !== undefined && lastIndentedToken !== undefined &&
	lastIndentedToken.lineIndex === prevLineToken.lineIndex) {
		return true;
	}
	return false;
}

export function sanitizeIndentation(code) {
	const lines = code.split('\n');
	if (!lines.some(lineMightNeedFixing))
		return code;

	const tokens = scan(code);
	let lastIndexIndented;
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		let prefix = lineToPrefix(line);
		if (prefixMightNeedFixing(prefix)) {
			let indentChar = '\t';
			if (i !== 0) {
				const prevPrefix = lineToPrefix(lines[i - 1]);
				if (prevPrefix !== '') {
					indentChar = prevPrefix[0];
				}
			}
			const afterPart = line.substring(prefix.length);
			prefix = replaceWhitespaces(prefix, indentChar);
			if (shouldAddIndent(i, tokens, lastIndexIndented)) {
				let indentSpaces = '\t';
				if (indentChar !== '\t')
					indentSpaces = ' '.repeat(4);
				prefix += indentSpaces;
				let index = indentationBinarySearch(i, tokens);
				if ( Number.isInteger(index) ) { 
					for (; index >= 1; index--) {
						const tok = tokens[index];
						const prev = tokens[index - 1];
						if (prev.s.trim() === '' || tok.lineIndex !== prev.lineIndex)
							break;
					}
					if ( index === 1 && tokens[0].s.trim() !== '' )
						index--;

					const colIndex = tokens[index].colIndex;
					const newToken = new Token(indentSpaces, colIndex, i);
					tokens.splice(index, 0, newToken);
					lastIndexIndented = i;
				}
			}
			lines[i] = prefix + afterPart;
		}
	}
	return lines.join('\n');
};