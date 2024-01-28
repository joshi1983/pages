import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { getIteratorToken } from './getIteratorToken.js';
import { getStartValue } from './getStartValue.js';
import { getStopValue } from './getStopValue.js';
import { isRangeCall } from './isRangeCall.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { parsePythonNumberLiteral } from '../helpers/parsePythonNumberLiteral.js';

export function getIncrementStep(forLoopToken) {
	const iteratorToken = getIteratorToken(forLoopToken);
	if (isRangeCall(iteratorToken)) {
		const parameterValueTokens = filterBracketsAndCommas(iteratorToken.children);
		if (parameterValueTokens.length <= 2)
			return 1;
		if (parameterValueTokens[2].type === ParseTreeTokenType.NUMBER_LITERAL) {
			return parsePythonNumberLiteral(parameterValueTokens[2].val);
		}
	}
};