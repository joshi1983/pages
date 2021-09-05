import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { shouldBeTranslatedToPyRandRange } from './shouldBeTranslatedToPyRandRange.js';

export function isDependingOnPyRandRange(cachedParseTree) {
	const functionCalls = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_CALL);
	return functionCalls.some(callToken => shouldBeTranslatedToPyRandRange(cachedParseTree, callToken));
};