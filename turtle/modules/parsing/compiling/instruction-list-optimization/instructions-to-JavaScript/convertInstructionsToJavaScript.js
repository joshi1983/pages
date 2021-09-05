import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { canBeConverted } from './canBeConverted.js';
import { convertExtraInstructionsToJavaScript } from './convertExtraInstructionsToJavaScript.js';
import { finalOptimizeInstructions } from './optimize-js/final-optimize/finalOptimizeInstructions.js';
import { getStartIndexForInstructionCluster } from './getStartIndexForInstructionCluster.js';
import { instructionToJavaScript } from './instructionToJavaScript.js';
import { isJumpSafeInterval } from './isJumpSafeInterval.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { mergeIntoIfStatements } from './mergeIntoIfStatements.js';
import { mergeIntoIfElseStatements } from './mergeIntoIfElseStatements.js';
import { mergeJavaScriptInstructions } from './mergeJavaScriptInstructions.js';
import { parsedOptimizeInstructions } from './optimize-js/parsedOptimizeInstructions.js';
import { PopInstruction } from '../../../execution/instructions/PopInstruction.js';
import { processBinaryOperatorCluster, isBinaryOperatorCluster } from './processBinaryOperatorCluster.js';
import { processPushCluster, isPushClusterInstruction } from './processPushCluster.js';
import { removeInstructions } from '../removeInstructions.js';
import { shouldPush } from './shouldPush.js';

function shouldRemovePop(instructions, i) {
	if (i + 1 === instructions.length)
		return false;
	const instruction = instructions[i];
	if (instruction instanceof CallCommandInstruction &&
	instruction.command.returnTypes === null) {
		return instructions[i + 1] instanceof PopInstruction;
	}
	return true;
}

export function convertInstructionsToJavaScript(instructions, parameters, isForProcedure, compileOptions) {
	for (let i = instructions.length - 1; i >= 0; i--) {
		const instruction = instructions[i];
		if (isPushClusterInstruction(instruction)) {
			i = processPushCluster(instructions, i);
			continue;
		}
		else if (isBinaryOperatorCluster(instructions, i)) {
			i = processBinaryOperatorCluster(instructions, i);
			continue;
		}
		const startIndex = getStartIndexForInstructionCluster(instructions, i);
		if (canBeConverted(instruction) && startIndex !== undefined && isJumpSafeInterval(instructions, startIndex, i)) {
			let clusterCanBeConverted = true;
			for (let j = i - 1; j >= startIndex; j--) {
				if (!canBeConverted(instructions[j])) {
					clusterCanBeConverted = false;
					break;
				}
			}
			if (clusterCanBeConverted) {
				const result = instructionToJavaScript(instructions, i, {
					'isForProcedure': isForProcedure,
					'parameters': parameters
				}, compileOptions);
				let code = result.code;
				const namedFunctionsMap = result.namedFunctionsMap;
				let numToRemove = i - startIndex;
				if (shouldPush(instructions, i)) {
					code = 'context.valueStack.push(' + code + ')';
				}
				else if (shouldRemovePop(instructions, i))
					numToRemove++;
				const jsInstruction = new JavaScriptInstruction(code, instruction.parseTreeToken, namedFunctionsMap);
				instructions[startIndex] = jsInstruction;
				removeInstructions(instructions, startIndex + 1, numToRemove);
				i = startIndex;
			}
			else {
				i = startIndex;
			}
		}
	}
	if (compileOptions.mergeJavaScriptInstructions === true) {
		convertExtraInstructionsToJavaScript(instructions, isForProcedure, compileOptions);
		mergeJavaScriptInstructions(instructions);
	}
	if (compileOptions.parsedOptimize) {
		parsedOptimizeInstructions(instructions, isForProcedure);
		if (compileOptions.forProduction) {
			let numInstructions;
			while (true) {
				numInstructions = instructions.length;
				mergeIntoIfStatements(instructions);
				mergeIntoIfElseStatements(instructions);
				if (numInstructions === instructions.length)
					break;
			}
			if (compileOptions.mergeJavaScriptInstructions)
				mergeJavaScriptInstructions(instructions);
			parsedOptimizeInstructions(instructions, isForProcedure);
		}
		finalOptimizeInstructions(instructions, isForProcedure);
	}
};