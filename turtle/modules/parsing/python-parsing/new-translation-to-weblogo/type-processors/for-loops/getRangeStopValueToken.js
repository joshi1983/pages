import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { getIteratorToken } from './getIteratorToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

// Assumes the forToken has a range call.
// In other words, the caller is responsible to check isRangeCall(forToken) returns true before calling this.
export function getRangeStopValueToken(forToken) {
	if (forToken.type !== ParseTreeTokenType.FOR_LOOP)
		throw new Error(`Expected FOR_LOOP token but got ${ParseTreeTokenType.getNameFor(forToken.type)}`);
	const iteratorToken = getIteratorToken(forToken);
	const argList = iteratorToken.children[0];
	const parameterValueTokens = filterBracketsAndCommas(argList.children);
	let index;
	if (parameterValueTokens.length === 0)
		return; // undefined because the Python code is invalid.
	else if (parameterValueTokens.length === 1)
		index = 0;
	else
		index = 1;
	return parameterValueTokens[index];
};