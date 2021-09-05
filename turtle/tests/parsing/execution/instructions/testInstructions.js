import { testBinaryOperatorInstruction } from './testBinaryOperatorInstruction.js';
import { testCallHighOrderInstruction } from './testCallHighOrderInstruction.js';
import { testCreateLogoInstructionFromDTO } from './testCreateLogoInstructionFromDTO.js';
import { testDataTypeConverters } from './data-type-converters/testDataTypeConverters.js';
import { testIncrementForCounterInstruction } from './testIncrementForCounterInstruction.js';
import { testIncrementRepcountInstruction } from './testIncrementRepcountInstruction.js';
import { testJavaScriptFunctionCallInstruction } from './testJavaScriptFunctionCallInstruction.js';
import { testJavaScriptInstruction } from './testJavaScriptInstruction.js';
import { testJumpIfTrueInstruction } from './testJumpIfTrueInstruction.js';
import { testJumpInstruction } from './testJumpInstruction.js';
import { testOutputInstruction } from './testOutputInstruction.js';
import { testOutputNullInstruction } from './testOutputNullInstruction.js';
import { testPopForcountInstruction } from './testPopForcountInstruction.js';
import { testPopInstruction } from './testPopInstruction.js';
import { testPushFromStackInstruction } from './testPushFromStackInstruction.js';
import { testPushInstruction } from './testPushInstruction.js';
import { testPushMaxRepcountInstruction } from './testPushMaxRepcountInstruction.js';
import { testUnaryOperatorInstruction } from './testUnaryOperatorInstruction.js';
import { testVariableReadInstruction } from './testVariableReadInstruction.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testInstructions(logger) {
	wrapAndCall([
		testBinaryOperatorInstruction,
		testCallHighOrderInstruction,
		testCreateLogoInstructionFromDTO,
		testDataTypeConverters,
		testIncrementForCounterInstruction,
		testIncrementRepcountInstruction,
		testJavaScriptFunctionCallInstruction,
		testJavaScriptInstruction,
		testJumpIfTrueInstruction,
		testJumpInstruction,
		testOutputInstruction,
		testOutputNullInstruction,
		testPopForcountInstruction,
		testPopInstruction,
		testPushFromStackInstruction,
		testPushInstruction,
		testPushMaxRepcountInstruction,
		testUnaryOperatorInstruction,
		testVariableReadInstruction
	], logger);
};