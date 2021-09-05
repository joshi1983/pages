import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function isDependingOnIsDigit(cachedParseTree) {
	if (cachedParseTree._isDependingOnIsDigit === undefined) {
		cachedParseTree._isDependingOnIsDigit = getTokensByType(cachedParseTree,
		ParseTreeTokenType.FUNCTION_CALL).
			some(token => token.val === 'isdigit' &&
				token.parentNode.type === ParseTreeTokenType.DOT);
	}
	return cachedParseTree._isDependingOnIsDigit;
};