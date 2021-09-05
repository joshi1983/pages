import { getIteratorToken } from './getIteratorToken.js';
import { getStartToken } from './getStartToken.js';
import { isRangeCall } from './isRangeCall.js';
import { parsePythonNumberLiteral } from '../helpers/parsePythonNumberLiteral.js';

export function getStartValue(forLoopToken) {
	const iteratorToken = getIteratorToken(forLoopToken);
	if (isRangeCall(iteratorToken)) {
		const parameterValueToken = getStartToken(forLoopToken);
		if (parameterValueToken === undefined)
			return 0;
		return parsePythonNumberLiteral(parameterValueToken.val);
	}
};