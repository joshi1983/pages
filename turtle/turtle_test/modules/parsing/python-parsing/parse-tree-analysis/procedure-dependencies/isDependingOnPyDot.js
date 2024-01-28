import { getTokensByType } from '../../../parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function isDependingOnPyDot(cachedParseTree) {
	if (cachedParseTree._isDependingOnPyDot === undefined) {
		cachedParseTree._isDependingOnPyDot = getTokensByType(cachedParseTree,
		ParseTreeTokenType.FUNCTION_CALL).some(token => token.val === 'dot');
	}
	return cachedParseTree._isDependingOnPyDot;
};