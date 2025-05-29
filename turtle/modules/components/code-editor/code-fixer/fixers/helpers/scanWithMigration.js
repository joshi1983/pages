import { isAfterOrSame } from
'../../../../../parsing/generic-parsing-utilities/isAfterOrSame.js';
import { LogoScanner } from
'../../../../../parsing/LogoScanner.js';
import { StringBuffer } from
'../../../../../StringBuffer.js';
import { StringUtils } from
'../../../../../StringUtils.js';
import { Token } from
'../../../../../parsing/Token.js';

export function getSingleLineCommentsStartingWith(code, symbol) {
	const result = [];
	let colIndex = 0, lineIndex = 0;
	for (let i = 0; i < code.length + 1 - symbol.length; i++) {
		const comparableSubstring = code.substring(i, i + symbol.length);
		if (comparableSubstring === symbol) {
			const index = code.indexOf('\n', i);
			let s;
			if (index === -1) {
				s = code.substring(i);
				i = code.length;
			}
			else {
				s = code.substring(i, index);
				i = index;
			}
			colIndex += s.length - 1;
			const commentToken = new Token(s, colIndex, lineIndex);
			result.push(commentToken);
		}
		else if (comparableSubstring[0] === '\n') {
			colIndex = 0;
			lineIndex++;
		}
		else {
			colIndex++;
		}
	}
	return result;
};

export function removeSingleLineCommentsWithSymbol(code, symbol) {
	const comments = getSingleLineCommentsStartingWith(code, symbol);
	if (comments.length !== 0) {
		const newCode = new StringBuffer();
		let fromIndex = 0;
		let prevLineIndex = 0;
		let endFound = false;
		for (const comment of comments) {
			const toLineIndex = StringUtils.indexOfNthOccurrance(code,
				fromIndex, '\n', comment.lineIndex - 1 - prevLineIndex);
			let toIndex;
			if (toLineIndex < 0) {
				endFound = true;
				toIndex = fromIndex + comment.colIndex + 1 - comment.s.length;
			}
			else {
				prevLineIndex = comment.lineIndex;
				toIndex = toLineIndex + comment.colIndex + 2 - comment.s.length;
			}
			newCode.append(code.substring(fromIndex, toIndex));
			fromIndex = toIndex + comment.s.length;
			if (endFound)
				break;
		}
		if (!endFound)
			newCode.append(code.substring(fromIndex));
		return [newCode.toString(), comments];
	}
	return [code, []];
};

export function scanWithMigration(code, migrationInfo) {
	let comments = [];
	if (migrationInfo.singleLineCommentSymbol !== undefined) {
		[code, comments] = removeSingleLineCommentsWithSymbol(code, migrationInfo.singleLineCommentSymbol);
	}
	const webLogoTokens = LogoScanner.scan(code);
	let commentIndex = 0;
	let i;
	const result = [];
	for (i = 0; i < webLogoTokens.length && commentIndex < comments.length; i++) {
		const webLogoToken = webLogoTokens[i];
		while (commentIndex < comments.length &&
		!isAfterOrSame(comments[commentIndex], webLogoToken)) {
			result.push(comments[commentIndex++]);
		}
		result.push(webLogoToken);
	}
	for (i++; i < webLogoTokens.length; i++) {
		result.push(webLogoTokens[i]);
	}
	return webLogoTokens;
};