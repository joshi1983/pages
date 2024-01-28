import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { getIteratorToken } from './getIteratorToken.js';
import { isRangeCall } from './isRangeCall.js';
import { parsePythonNumberLiteral } from '../helpers/parsePythonNumberLiteral.js';

export function getStartToken(forLoopToken) {
	const iteratorToken = getIteratorToken(forLoopToken);
	if (isRangeCall(iteratorToken)) {
		const parameterValueTokens = filterBracketsAndCommas(iteratorToken.children);
		if (parameterValueTokens.length === 1)
			return;
		if (parameterValueTokens.length >= 2)
			return parameterValueTokens[0];
	}
};