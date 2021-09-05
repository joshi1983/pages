import { flatten } from
'../../../../generic-parsing-utilities/flatten.js';
import { getDataTypesFromAssignments } from './getDataTypesFromAssignments.js';
import { getDataTypesFromVariableReferences } from
'./getDataTypesFromVariableReferences.js';
import { evaluateDataTypesForToken } from
'./evaluateDataTypesForToken.js';
import { isPossibleData } from
'../../isPossibleData.js';
import { SetUtils } from
'../../../../../SetUtils.js';

export function evaluateTokenDataTypes(root, settings) {
	if (typeof settings !== 'object')
		throw new Error(`settings must be an object but found ${settings}`);

	const result = new Map();
	let tokens = new Set(flatten(root).filter(isPossibleData));
	getDataTypesFromVariableReferences(tokens, result);
	getDataTypesFromAssignments(tokens, result, settings);
	let continueLooping = true;
	while (continueLooping) {
		continueLooping = false;
		for (const token of tokens) {
			const val = evaluateDataTypesForToken(token, result, settings);
			if (val !== undefined) {
				continueLooping = true;
				result.set(token, val);
			}
		}
		tokens = new Set();
		SetUtils.remove(tokens, (t) => !result.has(t));
	}
	return result;
};