import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { shouldBeTranslatedToPyRandInt } from './shouldBeTranslatedToPyRandInt.js';

export function isDependingOnPyRandInt(cachedParseTree) {
	const functionCalls = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_CALL);
	return functionCalls.some(callToken => shouldBeTranslatedToPyRandInt(cachedParseTree, callToken));
};