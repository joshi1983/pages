import { testCachedParseTreeMethods } from
'./testCachedParseTreeMethods.js';
import { testCachedParseTreeTokenDataTypes } from
'./testCachedParseTreeTokenDataTypes.js';
import { testCachedParseTreeTokenValues } from
'./testCachedParseTreeTokenValues.js';
import { testGetVariables } from
'./testGetVariables.js';
import { testVariableDataTypes } from
'./variable-data-types/testVariableDataTypes.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testParseTreeAnalysis(logger) {
	wrapAndCall([
		testCachedParseTreeMethods,
		testCachedParseTreeTokenDataTypes,
		testCachedParseTreeTokenValues,
		testGetVariables,
		testVariableDataTypes
	], logger);
};