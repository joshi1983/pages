import { BinaryOperatorInstruction } from '../../../execution/instructions/BinaryOperatorInstruction.js';
import { getJavaScriptOperatorFromBinaryOperatorInstruction } from './binaryOperatorToJavaScript.js';
import { getExpressionFrom, isPushClusterInstruction } from './processPushCluster.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { removeInstructions } from '../removeInstructions.js';

export function isBinaryOperatorCluster(instructions, index) {
	const instruction = instructions[index];
	if (index < 2 || !(instruction instanceof BinaryOperatorInstruction))
		return false;
	if (isPushClusterInstruction(instructions[index - 1]))
		return true;
	return false;
};

export function processBinaryOperatorCluster(instructions, index, isForProcedure) {
	const instruction = instructions[index];
	const isLocal = isForProcedure === true ? false : undefined;
	const symbol = getJavaScriptOperatorFromBinaryOperatorInstruction(instruction);
	if (isPushClusterInstruction(instructions[index - 1]) && isPushClusterInstruction(instructions[index - 2])) {
		const code = 'context.valueStack.push(' + getExpressionFrom(instructions[index - 2], isLocal) +
			' ' + symbol + ' ' + getExpressionFrom(instructions[index - 1], isLocal)+');';
		instructions[index - 2] = new JavaScriptInstruction(code, instruction.parseTreeToken);
		removeInstructions(instructions, index - 1, 2);
		return index - 2;
	}
	else if (isPushClusterInstruction(instructions[index - 1])) {
		const code = 'context.valueStack[context.valueStack.length - 1] = (context.valueStack[context.valueStack.length - 1] ' +
			symbol + ' (' + getExpressionFrom(instructions[index - 1], isLocal)+'));';
		instructions[index - 1] = new JavaScriptInstruction(code, instruction.parseTreeToken);
		removeInstructions(instructions, index, 1);
		return index - 1;
	}
	return index;
};