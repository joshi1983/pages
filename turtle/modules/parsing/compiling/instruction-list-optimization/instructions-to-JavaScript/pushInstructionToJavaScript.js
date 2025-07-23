import { valueToJavaScript } from './valueToJavaScript.js';

export function pushInstructionToJavaScript(pushInstruction) {
	const result = valueToJavaScript(pushInstruction.value, 20);
	if (result.length > 1000)
		console.error(`result=${result}`);
	return result;
};