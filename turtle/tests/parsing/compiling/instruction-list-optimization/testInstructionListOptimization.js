import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testGetArgPushIndex } from './testGetArgPushIndex.js';
import { testGetVariableName } from './testGetVariableName.js';
import { testGetVariablesAssignedAConstant } from './testGetVariablesAssignedAConstant.js';
import { testInstructionsToJavaScript } from './instructions-to-JavaScript/testInstructionsToJavaScript.js';
import { testOptimizeOptionalForStepCalculation } from './testOptimizeOptionalForStepCalculation.js';
import { testRemoveInstructions } from './testRemoveInstructions.js';
import { testRemoveRepeatZeroIterationCheck } from './testRemoveRepeatZeroIterationCheck.js';
import { testRemoveUnneededJumpIfTrue } from './testRemoveUnneededJumpIfTrue.js';
import { testReplaceJumpIfTrueWithJump } from './testReplaceJumpIfTrueWithJump.js';
import { testSimplifyInstructions } from './testSimplifyInstructions.js';
import { testStaticEvaluateBinaryOperators } from './testStaticEvaluateBinaryOperators.js';
import { testStaticEvaluateCommands } from './testStaticEvaluateCommands.js';
import { testSubstituteLocalConstants } from './testSubstituteLocalConstants.js';
import { testSubstitutePushFromStackConstants } from './testSubstitutePushFromStackConstants.js';

export function testInstructionListOptimization(logger) {
	function namedLog(name) {
		return prefixWrapper(name, logger);
	}
	testGetArgPushIndex(namedLog('testGetArgPushIndex'));
	testGetVariableName(namedLog('testGetVariableName'));
	testGetVariablesAssignedAConstant(namedLog('testGetVariablesAssignedAConstant'));
	testInstructionsToJavaScript(namedLog('testInstructionsToJavaScript'));
	testOptimizeOptionalForStepCalculation(namedLog('testOptimizeOptionalForStepCalculation'));
	testRemoveInstructions(namedLog('testRemoveInstructions'));
	testRemoveRepeatZeroIterationCheck(namedLog('testRemoveRepeatZeroIterationCheck'));
	testRemoveUnneededJumpIfTrue(namedLog('testRemoveUnneededJumpIfTrue'));
	testReplaceJumpIfTrueWithJump(namedLog('testReplaceJumpIfTrueWithJump'));
	testSimplifyInstructions(namedLog('testSimplifyInstructions'));
	testStaticEvaluateBinaryOperators(namedLog('testStaticEvaluateBinaryOperators'));
	testStaticEvaluateCommands(namedLog('testStaticEvaluateCommands'));
	testSubstituteLocalConstants(namedLog('testSubstituteLocalConstants'));
	testSubstitutePushFromStackConstants(namedLog('testSubstitutePushFromStackConstants'));
};