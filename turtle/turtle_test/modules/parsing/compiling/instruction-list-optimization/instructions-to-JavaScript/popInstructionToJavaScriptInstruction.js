import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';

export function popInstructionToJavaScriptInstruction(instruction) {
	return new JavaScriptInstruction('context.valueStack.pop()', instruction.parseTreeToken);
};