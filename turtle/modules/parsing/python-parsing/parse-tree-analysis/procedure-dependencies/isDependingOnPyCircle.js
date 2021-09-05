import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { shouldBeTranslatedToPyCircle } from './shouldBeTranslatedToPyCircle.js';

export function isDependingOnPyCircle(cachedParseTree) {
	const functionCalls = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_CALL);
	return functionCalls.some(callToken => shouldBeTranslatedToPyCircle(cachedParseTree, callToken));
};