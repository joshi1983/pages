import { Token } from
'../../../../../../parsing/Token.js';
import { valueToLiteralCode } from
'../../../../../../valueToLiteralCode.js';

function getSymbolsInfo(s) {
	const result = [];
	for (let i = 0; i < s.length - 1; i++) {
		const ch = s[i];
		if (ch === '$') {
			const nextChar = s[i + 1];
			if (/[a-z_]/i.test(nextChar)) {
				const index = Math.max(0, s.substring(i + 2).search(/[^a-z_\d]/i, i + 2));
				const variableName = s.substring(i + 1, i + 2 + index);
				result.push({
					'i': i,
					'variableName': variableName
				});
			}
		}
	}
	return result;
}

function isOfInterest(tokens, i) {
	const token = tokens[i];
	const tokenS = token.s;
	if (tokenS.indexOf('$') === -1)
		return false;

	if (tokenS[0] !== '\'' ||
	!tokenS.endsWith('\'')) {
		if (tokenS[0] !== '"')
			return false;
	}
	return getSymbolsInfo(stringLiteralToValue(tokenS)).length !== 0;
}

function stringLiteralToValue(tokenS) {
	if (tokenS[0] === '"' || tokenS[0] === '\'')
		tokenS = tokenS.substring(1);
	if (tokenS.endsWith('\''))
		tokenS = tokenS.substring(0, tokenS.length - 1);
	
	return tokenS;
}

function stringsToTokens(stringParts, endPosition, literalLength) {
	const result = [];
	const lineIndex = endPosition.lineIndex;
	let colIndex = Math.max(0, endPosition.colIndex - literalLength);
	for (const s of stringParts) {
		result.push(new Token(s, colIndex, lineIndex));
		colIndex += s.length;
	}
	
	return result;
}

export function processStringTemplates(tokens) {
	let i;
	for (i = 0; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			const token = tokens[i];
			const s = stringLiteralToValue(token.s);
			const symbols = getSymbolsInfo(s);
			let fromIndex = 0;
			const wrapWithBrackets = symbols.length !== 2;
			const parts = [];
			// loop through all the parts and create tokens as needed.
			for (const info of symbols) {
				const len = info.i - fromIndex;
				if (fromIndex === 0) {
					if (wrapWithBrackets)
						parts.push('(');

					parts.push('word');
				}
				if (len > 0) {
					parts.push(valueToLiteralCode(s.substring(fromIndex, fromIndex + len)));
				}
				parts.push('str', ':' + info.variableName);
				fromIndex = info.i + 1 + info.variableName.length;
			}
			if (fromIndex < s.length - 1) {
				parts.push(valueToLiteralCode(s.substring(fromIndex)));
			}
			if (wrapWithBrackets)
				parts.push(')');
			const newTokens = stringsToTokens(parts, token, token.s.length);
			tokens.splice(i, 1, ...newTokens);
			i += newTokens.length - 1;
		}
	}
};