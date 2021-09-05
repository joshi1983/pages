import { testFunctionDefinitionToName } from
'./testFunctionDefinitionToName.js';
import { testIsCustomFunctionOrSub } from
'./testIsCustomFunctionOrSub.js';
import { testScanTokensToCustomFunctionNames } from
'./testScanTokensToCustomFunctionNames.js';
import { testVariableDataTypes } from
'./variable-data-types/testVariableDataTypes.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testParseTreeAnalysis(logger) {
	wrapAndCall([
		testFunctionDefinitionToName,
		testIsCustomFunctionOrSub,
		testScanTokensToCustomFunctionNames,
		testVariableDataTypes
	], logger);
};