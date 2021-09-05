import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { variableReadToJavaScript } from './variableReadToJavaScript.js';

export function variableReadInstructionToJavaScriptInstruction(instruction, isLocal) {
	return new JavaScriptInstruction(`context.valueStack.push(${variableReadToJavaScript(instruction, isLocal)})`, instruction.parseTreeToken);
};