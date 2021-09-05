import { testEvaluateTokenDataTypes } from './testEvaluateTokenDataTypes.js';
import { testEvaluateTokensBasic } from
'./testEvaluateTokensBasic.js';
import { testGetDataTypesFromAssignments } from
'./testGetDataTypesFromAssignments.js';
import { testGetDataTypesFromVariableReferences } from
'./testGetDataTypesFromVariableReferences.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testVariableDataTypes(logger) {
	wrapAndCall([
		testEvaluateTokenDataTypes,
		testEvaluateTokensBasic,
		testGetDataTypesFromAssignments,
		testGetDataTypesFromVariableReferences
	], logger);
};