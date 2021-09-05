import { DataTypes } from '../../data-types/DataTypes.js';
import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { setTypesForFunctionCalls } from './setTypesForFunctionCalls.js';
import { setTypesFromParseTreeTokenTypes } from './setTypesFromParseTreeTokenTypes.js';

export function analyzeTokenDataTypes(cachedParseTree, tokenValueMap) {
	const result = new Map();
	let allTokens = cachedParseTree.getAllTokens();
	setTypesFromParseTreeTokenTypes(allTokens, result);
	// compute data types off known token values.
	for (const [key, value] of tokenValueMap) {
		if (!result.has(key))
			result.set(key, DataTypes.getTypesCompatibleWithValue(value));
	}
	setTypesForFunctionCalls(getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_CALL), result);

	return result;
};