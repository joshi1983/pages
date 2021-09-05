import { testAddVariablesFromInitialVariables } from './testAddVariablesFromInitialVariables.js';
import { testAnalyzeInstructionListRepeatCounts } from './testAnalyzeInstructionListRepeatCounts.js';
import { testAnalyzeLengths } from './testAnalyzeLengths.js';
import { testEvaluateOutputFrequency } from './testEvaluateOutputFrequency.js';
import { testEvaluateTokenDataTypes } from './testEvaluateTokenDataTypes.js';
import { testEvaluateTokensBasic } from './testEvaluateTokensBasic.js';
import { testEvaluateTokensWithVariables } from './testEvaluateTokensWithVariables.js';
import { testGetAnalyzedVariables } from './testGetAnalyzedVariables.js';
import { testGetAnalyzedVariablesGeneral } from './testGetAnalyzedVariablesGeneral.js';
import { testGetInstructionListRepeatCountAdvanced } from './testGetInstructionListRepeatCountAdvanced.js';
import { testGetInstructionListRepeatCountBasic } from './testGetInstructionListRepeatCountBasic.js';
import { testGetLastSingleValueTokenForControlStructure } from './testGetLastSingleValueTokenForControlStructure.js';
import { testGetLastTokenForScope } from './testGetLastTokenForScope.js';
import { testGetRefTypes } from './testGetRefTypes.js';
import { testGetRequiredTypesFromAssertion } from './testGetRequiredTypesFromAssertion.js';
import { testGetTokenTypesAdvanced } from './testGetTokenTypesAdvanced.js';
import { testGetTokenTypesBasic } from './testGetTokenTypesBasic.js';
import { testGetTokenValueBasic } from './testGetTokenValueBasic.js';
import { testGetVariableAssignmentScopeStart } from './testGetVariableAssignmentScopeStart.js';
import { testGlobalVariables } from './global-variables/testGlobalVariables.js';
import { testIsLastInstructionAnOutput } from './testIsLastInstructionAnOutput.js';
import { testIsLocalAssignmentToken } from './testIsLocalAssignmentToken.js';
import { testLengthEvaluationDirectory } from './length-evaluation/testLengthEvaluationDirectory.js';
import { testProcedureCallGraph } from './testProcedureCallGraph.js';
import { testProcessRequiredTypeParameters } from './testProcessRequiredTypeParameters.js';
import { testProcessRequiredTypes } from './testProcessRequiredTypes.js';
import { testProcessTokenDataTypesFromMultipleVariableAssignmentScopes } from './testProcessTokenDataTypesFromMultipleVariableAssignmentScopes.js';
import { testSetLastSingleValueTokens } from './testSetLastSingleValueTokens.js';
import { testShouldScopeBeReduced } from './testShouldScopeBeReduced.js';
import { testVariable } from './testVariable.js';
import { testVariables } from './testVariables.js';
import { testVariableAssignmentScope } from './testVariableAssignmentScope.js';
import { testVariableAssignmentScopesDirectory } from './variable-assignment-scopes/testVariableAssignmentScopesDirectory.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testVariableDataTypes(logger) {
	wrapAndCall([
		testAddVariablesFromInitialVariables,
		testAnalyzeInstructionListRepeatCounts,
		testAnalyzeLengths,
		testEvaluateOutputFrequency,
		testEvaluateTokenDataTypes,
		testEvaluateTokensBasic,
		testEvaluateTokensWithVariables,
		testGetAnalyzedVariables,
		testGetAnalyzedVariablesGeneral,
		testGetInstructionListRepeatCountAdvanced,
		testGetInstructionListRepeatCountBasic,
		testGetLastSingleValueTokenForControlStructure,
		testGetLastTokenForScope,
		testGetRefTypes,
		testGetRequiredTypesFromAssertion,
		testGetTokenTypesAdvanced,
		testGetTokenTypesBasic,
		testGetTokenValueBasic,
		testGetVariableAssignmentScopeStart,
		testGlobalVariables,
		testIsLastInstructionAnOutput,
		testIsLocalAssignmentToken,
		testLengthEvaluationDirectory,
		testProcedureCallGraph,
		testProcessRequiredTypeParameters,
		testProcessRequiredTypes,
		testProcessTokenDataTypesFromMultipleVariableAssignmentScopes,
		testSetLastSingleValueTokens,
		testShouldScopeBeReduced,
		testVariable,
		testVariables,
		testVariableAssignmentScope,
		testVariableAssignmentScopesDirectory
	], logger);
};