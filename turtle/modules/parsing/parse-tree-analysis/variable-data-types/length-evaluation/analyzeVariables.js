import { analyzeLengthForVariable } from './analyzeLengthForVariable.js';

export function analyzeVariables(cachedParseTree, tokenLengthsMap, procedureCallsMayChangeLength, tokenValuesMap) {
	for (const [token, lengthInfo] of tokenLengthsMap) {
		analyzeLengthForVariable(cachedParseTree, tokenLengthsMap, token, procedureCallsMayChangeLength, tokenValuesMap);
	}
};