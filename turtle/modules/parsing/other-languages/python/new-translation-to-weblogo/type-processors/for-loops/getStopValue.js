import { getIteratorToken } from './getIteratorToken.js';
import { getRangeStopValueToken } from './getRangeStopValueToken.js';
import { isRangeCall } from './isRangeCall.js';
import { parsePythonNumberLiteral } from '../helpers/parsePythonNumberLiteral.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function getStopValue(forLoopToken) {
	if (forLoopToken.type !== ParseTreeTokenType.FOR_LOOP)
		throw new Error(`forLoopToken must have a type of FOR_LOOP.  Not: ${ParseTreeTokenType.getNameFor(forLoopToken.type)}`);
	const iteratorToken = getIteratorToken(forLoopToken);
	if (isRangeCall(iteratorToken)) {
		const stopValueToken = getRangeStopValueToken(forLoopToken);
		return parsePythonNumberLiteral(stopValueToken.val);
	}
};