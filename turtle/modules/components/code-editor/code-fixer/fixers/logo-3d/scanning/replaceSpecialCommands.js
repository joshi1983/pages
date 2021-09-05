import { isIdentifier } from './isIdentifier.js';
import { isNumberLiteral } from './isNumberLiteral.js';
import { isStringLiteral } from './isStringLiteral.js';

const commandsExpectingBoolean = new Set([
	'if', 'while'
]);

function getToken(tokens, i, offset) {
	const absOffset = Math.abs(offset);
	const sign = Math.sign(offset);
	let t = 0;
	for (let j = 1; j <= absOffset; j++) {
		while (true) {
			t++;
			const token = tokens[i + sign * t];
			if (token === undefined)
				return;
			if (token.s !== '\n')
				break;
		}
	}
	return tokens[i + sign * t];
}

function isComparisonLikely(tokens, i) {
	const prevPrev = getToken(tokens, i, -2);
	if (prevPrev === undefined)
		return false;

	const prev = getToken(tokens, i, -1);
	const prevS = prev.s;
	if (!isNumberLiteral(prevS) && !isIdentifier(prevS) && !isStringLiteral(prevS))
		return false;

	const after = getToken(tokens, i, 1);
	if (after === undefined)
		return false;

	if (commandsExpectingBoolean.has(prevPrev.s.toLowerCase()))
		return true;

	const afterAfter = getToken(tokens, i, 2);
	if (afterAfter !== undefined && afterAfter.s === '[')
		return true; // likely the start of an instruction list

	return false;
}

function processGT(tokens, i) {
	if (isComparisonLikely(tokens, i)) {
		tokens[i].s = '>';
	}
}

function processLT(tokens, i) {
	if (isComparisonLikely(tokens, i)) {
		tokens[i].s = '<';
	}
}

const map = new Map([
	['got', processGT],
		// got is a misspelling of gt found in some example programs from Steve Slater.
	['gt', processGT],
	['lt', processLT]
]);

export function replaceSpecialCommands(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const processor = map.get(token.s.toLowerCase());
		if (processor !== undefined) {
			processor(tokens, i);
		}
	}
};