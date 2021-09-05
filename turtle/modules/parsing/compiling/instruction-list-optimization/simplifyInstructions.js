import { convertInstructionsToJavaScript } from './instructions-to-JavaScript/convertInstructionsToJavaScript.js';
import { optimizeOptionalForStepCalculation } from './optimizeOptionalForStepCalculation.js';
import { removeNotImmediatelyAfterComparison } from './removeNotImmediatelyAfterComparison.js';
import { removeRepeatZeroIterationCheck } from './removeRepeatZeroIterationCheck.js';
import { replaceJumpIfTrueWithJump } from './replaceJumpIfTrueWithJump.js';
import { staticEvaluateBinaryOperators } from './staticEvaluateBinaryOperators.js';
import { staticEvaluateCommands } from './staticEvaluateCommands.js';
import { staticEvaluateUnaryOperators } from './staticEvaluateUnaryOperators.js';
import { substituteLocalConstants } from './substituteLocalConstants.js';

export function simplifyInstructions(instructions, parameters, isForProcedure, compileOptions) {
	if (typeof isForProcedure !== 'boolean')
		throw new Error('isForProcedure must be boolean.  Got: ' + isForProcedure);
	if (typeof compileOptions.translateToJavaScript !== 'boolean')
		throw new Error('compileOptions.translateToJavaScript must be either true or false.  Got: ' + compileOptions.translateToJavaScript);

	let previousLength = instructions.length + 1;
	// + 1 to make the comparison condition true for first iteration.
	while (previousLength !== instructions.length) {
		previousLength = instructions.length;

		// The following optimizations are run in an order that maximizes
		// their likelihood of changing the instruction length.
		removeNotImmediatelyAfterComparison(instructions);
		staticEvaluateBinaryOperators(instructions);
		staticEvaluateCommands(instructions);
		staticEvaluateUnaryOperators(instructions);
		substituteLocalConstants(instructions, parameters);
		replaceJumpIfTrueWithJump(instructions);
		removeRepeatZeroIterationCheck(instructions);
		optimizeOptionalForStepCalculation(instructions);
	}
	if (compileOptions.translateToJavaScript === true)
		convertInstructionsToJavaScript(instructions, parameters, isForProcedure, compileOptions);
};