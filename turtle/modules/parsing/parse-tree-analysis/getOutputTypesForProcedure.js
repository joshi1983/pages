import { CommandCalls } from './CommandCalls.js';
import { DataTypes } from '../data-types/DataTypes.js';
import { getDescendentsOfType } from '../parse-tree-token/getDescendentsOfType.js';
import { getPossibleDataTypesEvaluatedFromToken } from './getPossibleDataTypesEvaluatedFromToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function getOutputTypesForProcedure(procStartToken, proceduresMap, varNamesNotToCheck) {
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');
	if (!(varNamesNotToCheck instanceof Set))
		throw new Error('varNamesNotToCheck must be a Set');
	if (procStartToken.children.length < 3)
		return null; // invalid procedure but validation checks are responsible for pointing that out.

	const procTokens = getDescendentsOfType(procStartToken.children[2], ParseTreeTokenType.PARAMETERIZED_GROUP);
	// get any stop calls.
	const stopTokens = CommandCalls.filterCommandCalls(procTokens, 'stop');
	if (stopTokens.length !== 0)
		return null; // indicate may output null.

	// get any output calls.
	const outputTokens = CommandCalls.filterCommandCalls(procTokens, 'output');
	if (outputTokens.length === 0)
		return null;
	let result;
	outputTokens.forEach(function(outputToken) {
		if (outputToken.children.length === 1) {
			const moreTypes = getPossibleDataTypesEvaluatedFromToken(outputToken.children[0], proceduresMap, varNamesNotToCheck);
			if (result === undefined)
				result = moreTypes;
			else
				result.addTypes(moreTypes);
		}
	});
	return result;
};