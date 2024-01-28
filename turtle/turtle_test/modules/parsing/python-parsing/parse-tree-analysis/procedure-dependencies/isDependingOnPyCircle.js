import { getTokensByType } from '../../../parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { shouldBeTranslatedToPyCircle } from './shouldBeTranslatedToPyCircle.js';

export function isDependingOnPyCircle(cachedParseTree) {
	const functionCalls = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_CALL);
	return functionCalls.some(callToken => shouldBeTranslatedToPyCircle(cachedParseTree, callToken));
};