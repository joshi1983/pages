import { convertInstructionsToJavaScript } from './instructions-to-JavaScript/convertInstructionsToJavaScript.js';
import { optimizeOptionalForStepCalculation } from './optimizeOptionalForStepCalculation.js';
import { removeAlwaysSkippedInstructions } from './removeAlwaysSkippedInstructions.js';
import { removeNotImmediatelyAfterComparison } from './removeNotImmediatelyAfterComparison.js';
import { removeRepeatZeroIterationCheck } from './removeRepeatZeroIterationCheck.js';
import { removeUnneededJumpIfTrue } from './removeUnneededJumpIfTrue.js';
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

	const startTime = Date.now();
	let printCount = 0;
	let i = 0;
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
		removeUnneededJumpIfTrue(instructions);
		replaceJumpIfTrueWithJump(instructions);
		removeAlwaysSkippedInstructions(instructions);
		removeRepeatZeroIterationCheck(instructions);
		optimizeOptionalForStepCalculation(instructions);
		i++;
		const duration1 = Date.now() - startTime;
		if (duration1 > 1000 && printCount < 3) {
			printCount++;
			console.log(`In while loop, i=${i}, duration1=${duration1}`);
		}
	}
	if (compileOptions.translateToJavaScript === true) {
		convertInstructionsToJavaScript(instructions, parameters, isForProcedure, compileOptions);
		const duration2 = Date.now() - startTime;
		if (duration2 > 1000) {
			console.log(`after convertInstructionsToJavaScript, duration2=${duration2}`);
		}
	}
};