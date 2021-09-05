import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { pushFromStackInstructionToJavaScript } from './pushFromStackInstructionToJavaScript.js';

export function pushFromStackInstructionToJavaScriptInstruction(instruction) {
	const code = pushFromStackInstructionToJavaScript(instruction);
	return new JavaScriptInstruction(code, instruction.parseTreeToken);
};