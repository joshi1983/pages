import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { PushInstruction } from '../../../execution/instructions/PushInstruction.js';
import { removeInstructions } from '../removeInstructions.js';
import { Transparent } from '../../../../Transparent.js';
import { VariableReadInstruction } from '../../../execution/instructions/VariableReadInstruction.js';

function getStopIndex(instructions, startIndex) {
	for (let i = startIndex; i >= 0; i--) {
		const instruction = instructions[i];
		if (!isPushClusterInstruction(instruction))
			return i + 1;
	}
	return startIndex;
}

export function getExpressionFrom(instruction, isLocal) {
	if (instruction instanceof PushInstruction) {
		if (instruction.value === Transparent)
			return "this.Transparent";
		else
			return JSON.stringify(instruction.value);
	}
	else {
		if (isLocal === true)
			return `context.getCurrentExecutingProcedure().localVariables.get("${instruction.variableName}")`;
		else if (isLocal === false)
			return `context.globalVariables.get("${instruction.variableName}")`;
		else
			return `context.readVariable("${instruction.variableName}")`;
	}
};

export function isPushClusterInstruction(instruction) {
	return instruction instanceof PushInstruction ||
		instruction instanceof VariableReadInstruction;
};

export function processPushCluster(instructions, index) {
	const stopIndex = getStopIndex(instructions, index);
	let expressions = [];
	for (let i = stopIndex; i <= index; i++) {
		expressions.push(getExpressionFrom(instructions[i]));
	}
	const code = 'context.valueStack.push(' + expressions.join(',') + ')';
	instructions[stopIndex] = new JavaScriptInstruction(code, instructions[stopIndex].parseTreeToken);
	removeInstructions(instructions, stopIndex + 1, index - stopIndex);
	return stopIndex;
};