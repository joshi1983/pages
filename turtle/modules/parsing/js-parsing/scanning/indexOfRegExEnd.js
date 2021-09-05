import { endsWithPotentialRegularExpressionFlags } from './endsWithPotentialRegularExpressionFlags.js';
import { isComment } from './isComment.js';
import { isCompleteRegularExpression } from './isCompleteRegularExpression.js';
import { SetUtils } from '../../../SetUtils.js';

const regexAdjacents = [
',', '.', '(', ')', '[', ']'
];
const regexBefores = new Set([
'(', '['
]);
const regexAfters = new Set([
')', ']'
]);
SetUtils.addAll(regexBefores, regexAdjacents);
SetUtils.addAll(regexAfters, regexAdjacents);

function canBeBeforeRegex(token) {
	if (token === undefined)
		return true;
	if (regexBefores.has(token.s))
		return true;
	return false;
}

function canBeAfterRegex(token) {
	if (token === undefined)
		return true;
	if (regexAfters.has(token.s))
		return true;
	return false;
}

function isAdjacent(token1, token2) {
	if (token1 === undefined || token2 === undefined)
		return false;
	if (token2.lineIndex === token1.lineIndex &&
	token2.colIndex === token1.colIndex + token1.s.length)
		return true;
	if (token2.lineIndex !== token1.lineIndex) {
		const lines = token2.s.split('\n');
		if (lines.length + token1.lineIndex !== token2.lineIndex)
			return false;
	}
	return true;
}

export function indexOfRegExEnd(tokens, startIndex) {
	let token = tokens[startIndex];
	if (!token.s.startsWith('/') || token.s.startsWith('//'))
		return -1;
	if (startIndex !== 0 &&
	!tokens[startIndex - 1].s.endsWith('\n') &&
	isAdjacent(tokens[startIndex - 1], token) &&
	!canBeBeforeRegex(tokens[startIndex - 1]))
		return -1;
	let s = '';
	for (let i = startIndex; i < tokens.length; i++) {
		token = tokens[i];
		s += token.s;
		if (i === startIndex) {
			if (token.s === '/')
				continue;
			if (token.s.lastIndexOf('/') === 0)
				continue;
		}
		if (isComment(token))
			return -1;
		if (endsWithPotentialRegularExpressionFlags(token.s)) {
			if (isAdjacent(tokens[i], tokens[i + 1])) {
				if (canBeAfterRegex(tokens[i + 1])) {
					if (isCompleteRegularExpression(s))
						return i;
					else
						return -1;
				}
				else
					return -1;
			}
			else
				return i;
		}
	}
	return -1;
};