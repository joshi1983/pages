import { Token } from
'../../../../../../parsing/Token.js';

const bracketPairs = [
	['[', ']'],
	['(', ')'],
	['to', 'end'] // not a "bracket" exactly but including the pair should help.
];
const openBrackets = new Set();
const closeBrackets = new Set();
const openCloseMap = new Map();
const closeOpenMap = new Map();
for (const [openBracket, closeBracket] of bracketPairs) {
	openBrackets.add(openBracket);
	closeBrackets.add(closeBracket);
	openCloseMap.set(openBracket, closeBracket);
	closeOpenMap.set(closeBracket, openBracket);
}

function insertCloseBrackets(tokens, i, stackIndex, stack) {
	let posToken = tokens[i - 1];
	const newTokens = [];
	for (let j = stack.length - 1; j > stackIndex; j--) {
		const openBracket = stack[j];
		const expectedCloseBracket = openCloseMap.get(openBracket);
		const newToken = new Token(expectedCloseBracket, posToken.colIndex + 1, posToken.lineIndex);
		newTokens.push(newToken);
		posToken = newToken;
	}
	tokens.splice(i, 0, ...newTokens);
	i += newTokens.length;
	stack.length = Math.max(0, stackIndex);
	return {'i': i};
}

export function removeUnbalancedClosingBrackets(tokens) {
	const stack = [];
	let closeTrailingOpenBrackets = true;
	for (let i = 0; i < tokens.length; i++) {
		const s = tokens[i].s.toLowerCase();
		if (openBrackets.has(s)) {
			if (s === 'to') {
				const info = insertCloseBrackets(tokens, i, -1, stack);
				i = info.i;
			}
			stack.push(s);
		}
		else if (closeBrackets.has(s)) {
			const stackTopOpeningBracket = stack[stack.length - 1];
			if (stackTopOpeningBracket !== undefined) {
				const expectedCloseBracket = openCloseMap.get(stackTopOpeningBracket);
				if (expectedCloseBracket === s) {
					// perfect match found.  No problem found here.
					stack.pop();
					continue;
				}
			}
			// A bracket balancing problem was found.
			// is it a kind of problem where removing the closing bracket will very likely help?
			const expectedOpenBracket = closeOpenMap.get(s);
			const stackIndex = stack.lastIndexOf(expectedOpenBracket);
			if (stackIndex === -1) {
				// The corresponding bracket isn't in the stack at all so 
				// yes, we should remove the erroneous close bracket.
				tokens.splice(i, 1);
				i--; // cancel the effect of i++ so the same index gets visited again.
			}
			else {
				closeTrailingOpenBrackets = false;
				if (s === 'end') {
					const info = insertCloseBrackets(tokens, i, stackIndex, stack);
					i = info.i;
				}
			}
		}
		if (closeTrailingOpenBrackets) {
			for (let i = stack.length - 1; i >= 0; i--) {
				const openBracket = stack[i];
				const expectedCloseBracket = openCloseMap.get(openBracket);
				const lastToken = tokens[tokens.length - 1];
				const newToken = new Token(expectedCloseBracket, expectedCloseBracket.length - 1, lastToken.lineIndex + 1);
				tokens.push(newToken);
			}
		}
	}
};