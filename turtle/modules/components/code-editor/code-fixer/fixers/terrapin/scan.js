import { isStartOfNumber } from
'../../../../../parsing/scanning/isStartOfNumber.js';
import { LogoScanner } from
'../../../../../parsing/LogoScanner.js';
import { validateIdentifier } from
'../../../../../parsing/parse-tree-analysis/validateIdentifier.js';

const specialListStringTokens = new Set([
	'label', 'print', 'pr', 'setfont',
	'tt', 'turtletext', 'type'
]);

const quoteReplacements = new Map([
	['“', '"'], ['”', '"']
]);

function sanitizeQuotes(tokens) {
	for (const token of tokens) {
		if (quoteReplacements.has(token.s[0]))
			token.s = quoteReplacements.get(token.s[0]) + token.s.substring(1);
	}
}

function mergePipedStringLiteralTokens(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.s.startsWith('"|')) {
			// look for a token ending with | or a token that goes to a new line.
			let joinedS = '\'';
			const startIndex = token.colIndex - token.s.length + 1;
			let j;
			for (j = i; j < tokens.length; j++) {
				const token2 = tokens[j];
				if (token2.lineIndex !== token.lineIndex)
					break;
				let s = token2.s;
				if (j === i)
					s = s.substring(2); // remove the " prefix.
				if (j > i) {
					const gap = token2.colIndex - joinedS.length - startIndex - s.length;
					joinedS += ' '.repeat(gap);
				}
				joinedS += s;
				if (token2.s.endsWith('|')) {
					joinedS = joinedS.substring(0, joinedS.length - 1); // remove the trailing |.
					break;
				}
			}
			token.s = joinedS + '\'';
			token.colIndex = startIndex + token.s.length - 1;
			tokens.splice(i + 1, j - i);
		}
	}
}

function mergeSpecialListLiterals(tokens) {
	for (let i = 1; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.s === '[' && specialListStringTokens.has(tokens[i - 1].s.toLowerCase())) {
			// look for a token ending with | or a token that goes to a new line.
			let joinedS = '\'';
			const startIndex = token.colIndex;
			let isGoodCase = true;
			let j;
			let token2;
			for (j = i + 1; j < tokens.length; j++) {
				token2 = tokens[j];
				if (token2.s === '[') {
					isGoodCase = false;
					break;
				}
				if (token2.s === ']')
					break;
				if (j !== i + 1)
					joinedS += ' ';
				joinedS += token2.s;
			}
			if (isGoodCase) {
				token.s = joinedS + '\'';
				token.colIndex = token2.colIndex;
				token.lineIndex = token2.lineIndex;
				tokens.splice(i + 1, j - i);
			}
		}
	}
}

function isPositiveNumeric(s) {
	return isStartOfNumber('-' + s);
}

export function isGoodPlaceToMergeNegative(tokens, index) {
	let possibleBinaryOperandFound = false;
	// if directly in curved bracket expression, return false.
	for (let i = index - 1; i >= 0; i--) {
		const token = tokens[i];
		if (token.s === '[')
			return true;
		if (token.s === ']')
			return true; // can't subtract from a list so likely a good case to merge.
		if (token.s === '(') {
			if (!possibleBinaryOperandFound)
				return true;
			return false;
		}
		if (isStartOfNumber(token.s) ||
		validateIdentifier(token.s) === undefined)
			possibleBinaryOperandFound = true;
	}
	return true;
};

function mergeNegativeNumberLiterals(tokens) {
	for (let i = 1; i < tokens.length - 1; i++) {
		const token = tokens[i];
		const next = tokens[i + 1];
		if (token.lineIndex === next.lineIndex &&
		token.colIndex === next.colIndex - next.s.length &&
		token.s === '-' && isPositiveNumeric(next.s) &&
		isGoodPlaceToMergeNegative(tokens, i)) {
			token.s = '-' + next.s;
			token.colIndex = next.colIndex;
			tokens.splice(i + 1, 1); // remove the next token.
		}
	}
}

export function scan(code) {
	const tokens = LogoScanner.scan(code);
	sanitizeQuotes(tokens);
	mergePipedStringLiteralTokens(tokens);
	mergeSpecialListLiterals(tokens);
	mergeNegativeNumberLiterals(tokens);
	return tokens;
};