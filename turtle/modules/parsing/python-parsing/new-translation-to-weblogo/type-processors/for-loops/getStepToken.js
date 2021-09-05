import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { getIteratorToken } from './getIteratorToken.js';
import { isRangeCall } from './isRangeCall.js';

export function getStepToken(forLoopToken) {
	const iteratorToken = getIteratorToken(forLoopToken);
	if (isRangeCall(iteratorToken)) {
		const argList = iteratorToken.children[0];
		if (argList === undefined)
			return;
		const parameterValueTokens = filterBracketsAndCommas(argList.children);
		if (parameterValueTokens.length <= 2)
			return;
		return parameterValueTokens[2];
	}
};