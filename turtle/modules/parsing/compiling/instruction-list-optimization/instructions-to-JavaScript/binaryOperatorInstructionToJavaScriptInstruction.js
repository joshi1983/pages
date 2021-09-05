import { getJavaScriptOperatorFromBinaryOperatorInstruction } from './binaryOperatorToJavaScript.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';

export function binaryOperatorInstructionToJavaScriptInstruction(instruction) {
	let jsOperatorSymbol = getJavaScriptOperatorFromBinaryOperatorInstruction(instruction);

	return new JavaScriptInstruction('context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 2] ' +
		jsOperatorSymbol + ' context.valueStack[context.valueStack.length - 1];\ncontext.valueStack.pop();', instruction.parseTreeToken);
};