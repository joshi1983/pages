import { isIdentifier } from '../isIdentifier.js';
import { isSingleLineComment } from '../isSingleLineComment.js';
import { PythonFunctions } from '../../PythonFunctions.js';

function isAssignmentOfInterest(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s !== '=')
		return false;

	const prev = scanTokens[i - 1];
	if (prev === undefined)
		return false;

	const next = scanTokens[i + 1];
	if (token.lineIndex !== prev.lineIndex ||
	next === undefined ||
	!isIdentifier(prev.s) || // for example, p[2] = y
	PythonFunctions.getFunctionInfo(next.s) === undefined ||
	token.lineIndex !== next.lineIndex ||
	!isIdentifier(next.s))
		return false; 

	const prevPrev = scanTokens[i - 2];
	if (prevPrev !== undefined) { 
		if (prevPrev.lineIndex === token.lineIndex)
			return false; // for example p.x = y
	}
	const nextNext = scanTokens[i + 2];
	if (nextNext !== undefined && nextNext.lineIndex === token.lineIndex) {
		if (!isSingleLineComment(nextNext.s))
			return false;
	}
	return true;
}

function isLikelyFunctionCall(scanTokens, i) {
	const token = scanTokens[i];
	if (!isIdentifier(token.s))
		return false;

	const next = scanTokens[i + 1];
	if (next.s !== '(' || next.lineIndex !== token.lineIndex)
		return false; // for example x = 3

	const prev = scanTokens[i - 1];
	if (prev !== undefined) {
		if (prev.lineIndex === token.lineIndex && prev.s === '.')
			return false; // for example p.x()
	}
	return true;
}

function getRenamesMap(scanTokens) {
	const result = new Map();
	const namesOfFunctionsCalled = new Set();
	for (let i = scanTokens.length - 2; i >= 0; i--) {
		if (isLikelyFunctionCall(scanTokens, i))
			namesOfFunctionsCalled.add(scanTokens[i].s);
	}
	for (let i = scanTokens.length - 2; i >= 1; i--) {
		if (namesOfFunctionsCalled.has(scanTokens[i - 1].s) &&
		isAssignmentOfInterest(scanTokens, i)) {
			result.set(scanTokens[i - 1].s, scanTokens[i + 1].s);
		}
	}
	return result;
}

export function simplifyFunctionRenames(scanTokens) {
	const renames = getRenamesMap(scanTokens);
	if (renames.size !== 0) {
		for (let i = 0; i < scanTokens.length; i++) {
			const prev = scanTokens[i - 1];
			const token = scanTokens[i];
			if (prev !== undefined &&
			renames.has(prev.s) && isAssignmentOfInterest(scanTokens, i)) {
				scanTokens.splice(i - 1, 3); // remove the assignment.
				i = Math.max(-1, i - 2);
			}
			else if (renames.has(token.s) && isLikelyFunctionCall(scanTokens, i)) {
				token.s = renames.get(token.s);
			}
		}
	}
};