import { valueToJavaScript } from './valueToJavaScript.js';

export function pushInstructionToJavaScript(pushInstruction) {
	return valueToJavaScript(pushInstruction.value, 20);
};