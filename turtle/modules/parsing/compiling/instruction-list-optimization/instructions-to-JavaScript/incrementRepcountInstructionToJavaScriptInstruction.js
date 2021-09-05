import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';

export function incrementRepcountInstructionToJavaScriptInstruction(instruction) {
	return new JavaScriptInstruction(`{\nlet repcountPair = context.repcountStack[context.repcountStack.length - 1];
		repcountPair.current++;
	context.valueStack.push(repcountPair.current <= repcountPair.max);\n}`, instruction.parseTreeToken);
};