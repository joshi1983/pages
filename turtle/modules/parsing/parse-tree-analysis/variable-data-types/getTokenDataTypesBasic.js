import { DataTypes } from '../../data-types/DataTypes.js';
import { getTokenTypesBasic } from './getTokenTypesBasic.js';
import { shouldBeEvaluatedForDataTypes } from './shouldBeEvaluatedForDataTypes.js';

export function getTokenDataTypesBasic(tokenValueMap, cachedParseTree, extraInfo, variables) {
	// compute data types off known token values.
	const result = new Map();
	for (const [key, value] of tokenValueMap) {
		result.set(key, DataTypes.getTypesCompatibleWithValue(value, extraInfo));
	}
	let tokensRemaining = cachedParseTree.getAllTokens().
		filter(shouldBeEvaluatedForDataTypes(cachedParseTree, variables)).
		filter(t => !result.has(t));
	tokensRemaining.forEach(function(token) {
		const types = getTokenTypesBasic(token, true, extraInfo);
		if (types !== undefined)
			result.set(token, types);
	});
	return result;
};