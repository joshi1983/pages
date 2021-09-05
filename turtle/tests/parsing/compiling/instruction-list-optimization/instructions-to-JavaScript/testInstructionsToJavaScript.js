import { testArgInfoToCheckFunction } from './testArgInfoToCheckFunction.js';
import { testAvoidUnneededErrorCheck } from './testAvoidUnneededErrorCheck.js';
import { testAvoidValueStackPush } from './testAvoidValueStackPush.js';
import { testBinaryOperatorToJavaScript } from './testBinaryOperatorToJavaScript.js';
import { testCallCommandInstructionToJavaScript } from './testCallCommandInstructionToJavaScript.js';
import { testCommands } from './commands/testCommands.js';
import { testContainsDynamicVariableAssignment } from './testContainsDynamicVariableAssignment.js';
import { testConvertInstructionsToJavaScript } from './testConvertInstructionsToJavaScript.js';
import { testConvertInstructionsToJavaScriptForMandelbrot } from './testConvertInstructionsToJavaScriptForMandelbrot.js';
import { testConvertInstructionsToJavaScriptForTransparent } from './testConvertInstructionsToJavaScriptForTransparent.js';
import { testGetConditionValueExpressionFrom } from './testGetConditionValueExpressionFrom.js';
import { testGetDeclarationsFromInstruction } from './testGetDeclarationsFromInstruction.js';
import { testGetInstructionParamArgInfo } from './testGetInstructionParamArgInfo.js';
import { testGetJumpToIndexes } from './testGetJumpToIndexes.js';
import { testGetStartIndexForInstructionCluster } from './testGetStartIndexForInstructionCluster.js';
import { testInstructionToJavaScriptInstruction } from './testInstructionToJavaScriptInstruction.js';
import { testIsLocalVariable } from './testIsLocalVariable.js';
import { testIsSafeToNotErrorCheck } from './testIsSafeToNotErrorCheck.js';
import { testMergeIntoIfElseStatements } from './testMergeIntoIfElseStatements.js';
import { testMergeIntoIfStatements } from './testMergeIntoIfStatements.js';
import { testMergeJavaScriptInstructions } from './testMergeJavaScriptInstructions.js';
import { testMergeJavaScriptInstructionsWithInvoke } from './testMergeJavaScriptInstructionsWithInvoke.js';
import { testOptimizeJSDirectory } from './optimize-js/testOptimizeJSDirectory.js';
import { testProcessBinaryOperatorCluster } from './testProcessBinaryOperatorCluster.js';
import { testPushInstructionToJavaScript } from './testPushInstructionToJavaScript.js';
import { testUnaryOperatorToJavaScript } from './testUnaryOperatorToJavaScript.js';
import { testWrapWithArgInfoChecks } from './testWrapWithArgInfoChecks.js';
import { testWrapWithTypeConverter } from './testWrapWithTypeConverter.js';
import { testVariableReadToJavaScript } from './testVariableReadToJavaScript.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

const tests = [
testArgInfoToCheckFunction,
testAvoidUnneededErrorCheck,
testAvoidValueStackPush,
testBinaryOperatorToJavaScript,
testCallCommandInstructionToJavaScript,
testCommands,
testContainsDynamicVariableAssignment,
testConvertInstructionsToJavaScript,
testConvertInstructionsToJavaScriptForMandelbrot,
testConvertInstructionsToJavaScriptForTransparent,
testGetConditionValueExpressionFrom,
testGetDeclarationsFromInstruction,
testGetInstructionParamArgInfo,
testGetJumpToIndexes,
testGetStartIndexForInstructionCluster,
testInstructionToJavaScriptInstruction,
testIsLocalVariable,
testIsSafeToNotErrorCheck,
testMergeIntoIfElseStatements,
testMergeIntoIfStatements,
testMergeJavaScriptInstructions,
testMergeJavaScriptInstructionsWithInvoke,
testOptimizeJSDirectory,
testProcessBinaryOperatorCluster,
testPushInstructionToJavaScript,
testUnaryOperatorToJavaScript,
testWrapWithArgInfoChecks,
testWrapWithTypeConverter,
testVariableReadToJavaScript
];

export function testInstructionsToJavaScript(logger) {
	wrapAndCall(tests, logger);
};