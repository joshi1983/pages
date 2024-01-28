import { StringBuffer } from '../../../../StringBuffer.js';

export function pushFromStackInstructionToJavaScript(pushFromStackInstruction) {
	const result = new StringBuffer();
	for (let i = 0; i < pushFromStackInstruction.numToPush; i++) {
		result.append(`context.valueStack.push(context.valueStack[context.valueStack.length - ${1 + i * 2}]);\n`);
	}
	return result.toString();
};