import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { getIteratorToken } from './getIteratorToken.js';
import { isRangeCall } from './isRangeCall.js';

export function getStepToken(forLoopToken) {
	const iteratorToken = getIteratorToken(forLoopToken);
	if (isRangeCall(iteratorToken)) {
		const parameterValueTokens = filterBracketsAndCommas(iteratorToken.children);
		if (parameterValueTokens.length <= 2)
			return;
		return parameterValueTokens[2];
	}
};