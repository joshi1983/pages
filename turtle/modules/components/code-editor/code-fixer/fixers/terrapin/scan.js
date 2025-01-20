import { LogoScanner } from
'../../../../../parsing/LogoScanner.js';

function mergePipedStringLiteralTokens(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.s.startsWith('"|')) {
			// look for a token ending with | or a token that goes to a new line.
			const tokensToJoin = [];
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

export function scan(code) {
	const tokens = LogoScanner.scan(code);
	mergePipedStringLiteralTokens(tokens);
	
	return tokens;
};