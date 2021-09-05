import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function isDependingOnPyInt(cachedParseTree) {
	if (cachedParseTree._isDependingOnPyInt === undefined) {
		cachedParseTree._isDependingOnPyInt = getTokensByType(cachedParseTree,
		ParseTreeTokenType.FUNCTION_CALL).
			some(token => (token.val === 'int') &&
			token.parentNode.type !== ParseTreeTokenType.DOT);
	}
	return cachedParseTree._isDependingOnPyInt;
};