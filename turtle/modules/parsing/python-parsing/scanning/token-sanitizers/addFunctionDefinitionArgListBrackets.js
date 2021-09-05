import { isIdentifier } from '../isIdentifier.js';
import { Token } from '../../../generic-parsing-utilities/Token.js';

function addArgListAtEnd(scanTokens) {
	const lastIndex = scanTokens.length - 1;
	if (lastIndex >= 1 &&
	scanTokens[lastIndex - 1].s === 'def' &&
	isIdentifier(scanTokens[lastIndex].s)) {
		const tok = scanTokens[lastIndex];
		const leftBracket = new Token('(', tok.colIndex + 1, tok.lineIndex);
		const rightBracket = new Token(')', tok.colIndex + 2, tok.lineIndex);
		const colon = new Token(':', tok.colIndex + 3, tok.lineIndex);
		scanTokens.push(leftBracket, rightBracket, colon);
	}
}

function shouldAddArgListBrackets(scanTokens, i) {
	if (scanTokens[i - 2].s !== 'def' ||
	!isIdentifier(scanTokens[i - 1].s))
		return false;
	const tok = scanTokens[i];
	if (tok.s === ':') {
		return true;
	}
	else {
		const prev = scanTokens[i - 1];
		if (tok.lineIndex > prev.lineIndex &&
		tok.s !== '(') {
			return true;
		}
	}
	return false;
}

export function addFunctionDefinitionArgListBrackets(scanTokens) {
	for (let i = 2; i < scanTokens.length ; i++) {
		if (shouldAddArgListBrackets(scanTokens, i)) {
			const tok = scanTokens[i];
			const leftBracket = new Token('(', tok.colIndex, tok.lineIndex);
			const rightBracket = new Token(')', tok.colIndex, tok.lineIndex);
			const newTokens = [leftBracket, rightBracket];
			if (tok.s !== ':')
				newTokens.push(new Token(':', tok.colIndex, tok.lineIndex));

			scanTokens.splice(i, 0, ...newTokens);
			i += 2;
		}
	}
	addArgListAtEnd(scanTokens);
};