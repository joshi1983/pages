import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';

export function popRepcountInstructionToJavaScriptInstruction(instruction) {
	return new JavaScriptInstruction('context.repcountStack.pop();', instruction.parseTreeToken);
};