import { StringBuffer } from
'../../../../StringBuffer.js';
import { Token } from
'../../../Token.js';

function splitFirstCharacter(tokens, i) {
	const token = tokens[i];
	const rightS = token.s.substring(1);
	token.s = "'";
	tokens.splice(i + 1, 0, new Token(rightS,
		token.colIndex, token.lineIndex
	));
	if (rightS.indexOf('\n') === -1)
		token.colIndex -= rightS.length;
}

function splitLastCharacter(tokens, i) {
	const token = tokens[i];
	const leftS = token.s.substring(0, token.s.length - 1);
	tokens.splice(i + 1, 0, new Token("'",
		token.colIndex, token.lineIndex
	));
	token.s = leftS;
	token.colIndex--;
}

function splitMiddleCharacter(tokens, i) {
	const token = tokens[i];
	const index = token.s.indexOf('|');
	const leftS = token.s.substring(0, index);
	const rightS = token.s.substring(index + 1);
	let pipeColIndex = token.colIndex;
	if (rightS.indexOf('\n') === -1)
		pipeColIndex -= rightS.length;
	const pipeToken = new Token("'", pipeColIndex,
		token.lineIndex);
	const rightToken = new Token(rightS, token.colIndex, token.lineIndex);
	tokens.splice(i, 0, pipeToken, rightToken);
	token.colIndex = pipeColIndex - 1;
	token.s = leftS;
}

function splitPipes(tokens) {
	let result = false;
	for (let i = 0; i < tokens.length; i++) {
		const s = tokens[i].s;
		if (s.length > 1 && s[0] !== "'") {
			let isSplit = true;
			if (s[0] === "|")
				splitFirstCharacter(tokens, i);
			else if (s[s.length - 1] === "|")
				splitLastCharacter(tokens, i);
			else if (s.indexOf('|') !== -1)
				splitMiddleCharacter(tokens, i);
			else
				isSplit = false;
			if (isSplit) {
				i--; // revisit the same token in case more splitting should happen.
				result = true;
			}
		}
	}
	return result;
}

function joinLongStringLiterals(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const startToken = tokens[i];
		const s = startToken.s;
		if (s === "'") {
			let sb = new StringBuffer();
			sb.append("'");
			let last = startToken;
			let literalTokenCount = 1;
			for (let j = i + 1; j < tokens.length; j++) {
				const token = tokens[j];
				if (token.s.indexOf('\n') === -1) {
					if (last.lineIndex === token.lineIndex) {
						const startColIndex = token.colIndex - token.s.length;
						sb.append(' '.repeat(startColIndex - last.colIndex));
					}
					else {
						sb.append('\n'.repeat(token.lineIndex - last.lineIndex));
					}
				} 
				sb.append(token.s);
				last = token;
				literalTokenCount++;
				if (token.s === "'") {
					break;
				}
			}
			startToken.s = sb.toString();
			startToken.colIndex = last.colIndex;
			startToken.lineIndex = last.lineIndex;
			tokens.splice(i + 1, literalTokenCount - 1);
		}
	}
}

export function processPipes(tokens) {
	if (splitPipes(tokens))
		joinLongStringLiterals(tokens);
};