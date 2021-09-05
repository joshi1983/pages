import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { getIteratorToken } from './getIteratorToken.js';
import { isRangeCall } from './isRangeCall.js';

export function getStartToken(forLoopToken) {
	const iteratorToken = getIteratorToken(forLoopToken);
	if (isRangeCall(iteratorToken)) {
		const argList = iteratorToken.children[0];
		const parameterValueTokens = filterBracketsAndCommas(argList.children);
		if (parameterValueTokens.length === 1)
			return;
		if (parameterValueTokens.length >= 2)
			return parameterValueTokens[0];
	}
};