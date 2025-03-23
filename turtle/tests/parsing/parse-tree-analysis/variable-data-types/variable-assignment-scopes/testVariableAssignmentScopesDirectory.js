import { testAddConditionalRangesToVariableAssignmentScope } from './testAddConditionalRangesToVariableAssignmentScope.js';
import { testAddScopesForPropertyLists } from './testAddScopesForPropertyLists.js';
import { testAddVariableAssignmentScopes } from './testAddVariableAssignmentScopes.js';
import { testAdjustSubtypesForLists } from './testAdjustSubtypesForLists.js';
import { testAnalyzeTokenTypesForProcedureCPROCs } from './testAnalyzeTokenTypesForProcedureCPROCs.js';
import { testFilterVariableScopesDeclaredAt } from './testFilterVariableScopesDeclaredAt.js';
import { testGetAnalyzedVariablesParameters } from './testGetAnalyzedVariablesParameters.js';
import { testGetAnalyzedVariableAssignmentScopes } from './testGetAnalyzedVariableAssignmentScopes.js';
import { testGetAnalyzedVariableAssignmentScopesSpecialCases } from
'./testGetAnalyzedVariableAssignmentScopesSpecialCases.js';
import { testGetAssignedDataTypesForParameter } from './testGetAssignedDataTypesForParameter.js';
import { testGetRequiredTypesForForSettingsToken } from
'./testGetRequiredTypesForForSettingsToken.js';
import { testGetSatisfyingDataTypes } from './testGetSatisfyingDataTypes.js';
import { testMightQueue2MutateManyVariables } from './testMightQueue2MutateManyVariables.js';
import { testProcessMutationsOfSingleValueLists } from './testProcessMutationsOfSingleValueLists.js';
import { testProcessMutationsOfSingleValueLists } from './testProcessMutationsOfSingleValueLists.js';
import { testRequiredTypes } from './required-types/testRequiredTypes.js';
import { testTightenRequiredTypesForScopesWithConditionalRanges } from
'./testTightenRequiredTypesForScopesWithConditionalRanges.js';
import { testTightenTokenDataTypesAfterAdjustSubtypesForLists } from
'./testTightenTokenDataTypesAfterAdjustSubtypesForLists.js';
import { testTypePredicateMap } from './testTypePredicateMap.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testVariableAssignmentScopesDirectory(logger) {
	wrapAndCall([
		testAddConditionalRangesToVariableAssignmentScope,
		testAddScopesForPropertyLists,
		testAddVariableAssignmentScopes,
		testAdjustSubtypesForLists,
		testAnalyzeTokenTypesForProcedureCPROCs,
		testFilterVariableScopesDeclaredAt,
		testGetAnalyzedVariablesParameters,
		testGetAnalyzedVariableAssignmentScopes,
		testGetAnalyzedVariableAssignmentScopesSpecialCases,
		testGetAssignedDataTypesForParameter,
		testGetRequiredTypesForForSettingsToken,
		testGetSatisfyingDataTypes,
		testMightQueue2MutateManyVariables,
		testProcessMutationsOfSingleValueLists,
		testRequiredTypes,
		testTightenRequiredTypesForScopesWithConditionalRanges,
		testTightenTokenDataTypesAfterAdjustSubtypesForLists,
		testTypePredicateMap
	], logger);
};