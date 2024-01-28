import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';

export function unaryOperatorInstructionToJavaScriptInstruction(instruction) {
	if (instruction.operatorSymbol !== '-')
		throw new Error('Only the - operator can be translated to JavaScript but got (' + instruction.operatorSymbol + ')');

	return new JavaScriptInstruction('{\nlet index=context.valueStack.length - 1;\ncontext.valueStack[index] = -context.valueStack[index];\n}', instruction.parseTreeToken);
};