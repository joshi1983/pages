import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';
import { Token } from
'../../../generic-parsing-utilities/Token.js';

function isEndingDef(tokens, i) {
	const token = tokens[i];
	if (token.s.toLowerCase() !== 'end')
		return false;

	const next = tokens[i + 1];
	if (next === undefined || next.s.toLowerCase() !== 'def')
		return false;
	return true;
}

function isEndingSub(tokens, i) {
	const token = tokens[i];
	if (token.s.toLowerCase() !== 'end')
		return false;

	const next = tokens[i + 1];
	if (next === undefined || next.s.toLowerCase() !== 'sub')
		return false;
	return true;
}

function isStartingDef(tokens, i) {
	const token = tokens[i];
	if (token.s.toLowerCase() !== 'def')
		return false;
	const next = tokens[i + 1];
	if (next === undefined || !isIdentifier(next.s))
		return false;
	return true;
}

function isStartingSub(tokens, i) {
	const token = tokens[i];
	if (token.s.toLowerCase() !== 'sub')
		return false;
	const next = tokens[i + 1];
	if (next === undefined || !isIdentifier(next.s))
		return false;
	return true;
}

function insertLinesAfter(tokens, startIndex) {
	// insert a couple lines to make sure the new tokens are on an empty line.
	for (let j = startIndex; j < tokens.length; j++)
		tokens[j].lineIndex += 2;	
}

function insertEnding(tokens, i, lineIndex, inSub) {
	if (!Number.isInteger(i))
		throw new Error(`i must be an integer but found ${i}`);
	if (!Number.isInteger(lineIndex))
		throw new Error(`lineIndex must be an integer but found ${lineIndex}`);
	if (typeof inSub !== 'boolean')
		throw new Error(`inSub must be boolean but found ${inSub}`);

	const endToken = new Token('end', 2, lineIndex);
	const subToken = new Token(inSub ? 'sub' : 'def', 6, lineIndex);
	tokens.splice(i, 0, endToken, subToken);
}

export function insertEndSubs(tokens) {
	let inSub = false;
	let inDef = false;
	let isMainFound = false;
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const startingSub = isStartingSub(tokens, i);
		if (startingSub || isStartingDef(tokens, i)) {
			const name = tokens[i + 1].s.toLowerCase();
			if (name.toLowerCase() === 'main')
				isMainFound = true;
			if (inSub || inDef) {
				const lineIndex = token.lineIndex + 1;
				insertLinesAfter(tokens, i);
				insertEnding(tokens, i, lineIndex, inSub);
				i += 2;
			}
			inSub = inDef = false;
			if (startingSub)
				inSub = true;
			else
				inDef = true;
			i ++;
		}
		else if (isEndingSub(tokens, i)) {
			inSub = false;
			i++;
		}
		else if (isEndingDef(tokens, i)) {
			inDef = false;
			i++;
		}
	}
	if (inSub || inDef) {
		insertEnding(tokens, tokens.length, tokens[tokens.length - 1].lineIndex, inSub);
	}
	if (isMainFound) {
		// if a main subroutine is defined, we want to call it.
		const lastToken = tokens[tokens.length - 1];
		const lineIndex = lastToken.lineIndex + 1;
		const mainToken = new Token('main', 4, lineIndex);
		const openBracket = new Token('(', 5, lineIndex);
		const closeBracket = new Token(')', 6, lineIndex);
		tokens.splice(tokens.length, 0, mainToken, openBracket, closeBracket);
	}
};