import { testGetArgPushIndex } from './testGetArgPushIndex.js';
import { testGetVariableName } from './testGetVariableName.js';
import { testGetVariablesAssignedAConstant } from './testGetVariablesAssignedAConstant.js';
import { testInstructionsToJavaScript } from './instructions-to-JavaScript/testInstructionsToJavaScript.js';
import { testOptimizeOptionalForStepCalculation } from './testOptimizeOptionalForStepCalculation.js';
import { testRemoveAlwaysSkippedInstructions } from './testRemoveAlwaysSkippedInstructions.js';
import { testRemoveInstructions } from './testRemoveInstructions.js';
import { testRemoveRepeatZeroIterationCheck } from './testRemoveRepeatZeroIterationCheck.js';
import { testRemoveUnneededJumpIfTrue } from './testRemoveUnneededJumpIfTrue.js';
import { testReplaceJumpIfTrueWithJump } from './testReplaceJumpIfTrueWithJump.js';
import { testSimplifyInstructions } from './testSimplifyInstructions.js';
import { testStaticEvaluateBinaryOperators } from './testStaticEvaluateBinaryOperators.js';
import { testStaticEvaluateCommands } from './testStaticEvaluateCommands.js';
import { testSubstituteLocalConstants } from './testSubstituteLocalConstants.js';
import { testSubstitutePushFromStackConstants } from './testSubstitutePushFromStackConstants.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

const tests = [
testGetArgPushIndex,
testGetVariableName,
testGetVariablesAssignedAConstant,
testInstructionsToJavaScript,
testOptimizeOptionalForStepCalculation,
testRemoveAlwaysSkippedInstructions,
testRemoveInstructions,
testRemoveRepeatZeroIterationCheck,
testRemoveUnneededJumpIfTrue,
testReplaceJumpIfTrueWithJump,
testSimplifyInstructions,
testStaticEvaluateBinaryOperators,
testStaticEvaluateCommands,
testSubstituteLocalConstants,
testSubstitutePushFromStackConstants
];

export function testInstructionListOptimization(logger) {
	wrapAndCall(tests, logger);
};