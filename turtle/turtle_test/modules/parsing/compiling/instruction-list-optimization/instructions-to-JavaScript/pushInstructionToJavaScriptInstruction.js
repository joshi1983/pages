import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { pushInstructionToJavaScript } from './pushInstructionToJavaScript.js';

export function pushInstructionToJavaScriptInstruction(instruction) {
	return new JavaScriptInstruction(`context.valueStack.push(${pushInstructionToJavaScript(instruction)});`, instruction.parseTreeToken);
};