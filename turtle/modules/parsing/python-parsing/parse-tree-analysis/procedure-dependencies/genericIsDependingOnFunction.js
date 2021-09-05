import { getTokensByType } from '../../../parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function genericIsDependingOnFunction(cacheKey, pythonFunctionName) {
	cacheKey = '_isDependingOn' + cacheKey;
	return function(cachedParseTree) {
		if (cachedParseTree[cacheKey] === undefined) {
			cachedParseTree[cacheKey] = getTokensByType(cachedParseTree,
			ParseTreeTokenType.FUNCTION_CALL).some(token => token.val === pythonFunctionName);
		}
		return cachedParseTree[cacheKey];
	};
};