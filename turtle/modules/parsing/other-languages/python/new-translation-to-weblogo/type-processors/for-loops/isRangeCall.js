import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function isRangeCall(iteratorToken) {
	return iteratorToken.val === 'range' &&
		iteratorToken.type === ParseTreeTokenType.FUNCTION_CALL;
};