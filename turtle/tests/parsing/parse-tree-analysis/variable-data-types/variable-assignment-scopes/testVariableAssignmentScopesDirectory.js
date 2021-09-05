import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testAddConditionalRangesToVariableAssignmentScope } from './testAddConditionalRangesToVariableAssignmentScope.js';
import { testAddScopesForPropertyLists } from './testAddScopesForPropertyLists.js';
import { testAddVariableAssignmentScopes } from './testAddVariableAssignmentScopes.js';
import { testAdjustSubtypesForLists } from './testAdjustSubtypesForLists.js';
import { testFilterVariableScopesDeclaredAt } from './testFilterVariableScopesDeclaredAt.js';
import { testGetAnalyzedVariablesParameters } from './testGetAnalyzedVariablesParameters.js';
import { testGetAnalyzedVariableAssignmentScopes } from './testGetAnalyzedVariableAssignmentScopes.js';
import { testGetAnalyzedVariableAssignmentScopesSpecialCases } from './testGetAnalyzedVariableAssignmentScopesSpecialCases.js';
import { testGetSatisfyingDataTypes } from './testGetSatisfyingDataTypes.js';
import { testMightQueue2MutateManyVariables } from './testMightQueue2MutateManyVariables.js';
import { testTightenTokenDataTypesAfterAdjustSubtypesForLists } from
'./testTightenTokenDataTypesAfterAdjustSubtypesForLists.js';
import { testTypePredicateMap } from './testTypePredicateMap.js';

export function testVariableAssignmentScopesDirectory(logger) {
	testAddConditionalRangesToVariableAssignmentScope(prefixWrapper('testAddConditionalRangesToVariableAssignmentScope', logger));
	testAddScopesForPropertyLists(prefixWrapper('testAddScopesForPropertyLists', logger));
	testAddVariableAssignmentScopes(prefixWrapper('testAddVariableAssignmentScopes', logger));
	testAdjustSubtypesForLists(prefixWrapper('testAdjustSubtypesForLists', logger));
	testFilterVariableScopesDeclaredAt(prefixWrapper('testFilterVariableScopesDeclaredAt', logger));
	testGetAnalyzedVariablesParameters(prefixWrapper('testGetAnalyzedVariablesParameters', logger));
	testGetAnalyzedVariableAssignmentScopes(prefixWrapper('testGetAnalyzedVariableAssignmentScopes', logger));
	testGetAnalyzedVariableAssignmentScopesSpecialCases(prefixWrapper('testGetAnalyzedVariableAssignmentScopesSpecialCases', logger));
	testGetSatisfyingDataTypes(prefixWrapper('testGetSatisfyingDataTypes', logger));
	testMightQueue2MutateManyVariables(prefixWrapper('testMightQueue2MutateManyVariables', logger));
	testTightenTokenDataTypesAfterAdjustSubtypesForLists(prefixWrapper('testTightenTokenDataTypesAfterAdjustSubtypesForLists', logger));
	testTypePredicateMap(prefixWrapper('testTypePredicateMap', logger));
};