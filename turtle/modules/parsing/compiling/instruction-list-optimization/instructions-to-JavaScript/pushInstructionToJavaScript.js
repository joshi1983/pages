import { StringBuffer } from '../../../../StringBuffer.js';

export function pushInstructionToJavaScript(pushInstruction) {
	if (pushInstruction.isCloningValue) {
		if (pushInstruction.value instanceof Array) {
			if (pushInstruction.value.length === 0)
				return 'new Array()';
			else
				return JSON.stringify(pushInstruction.value) + '.slice()';
		}
	}
	if (pushInstruction.value instanceof Map) {
		if (pushInstruction.value.size === 0)
			return 'new Map()';
		else {
			const result = new StringBuffer(50);
			result.append('new Map([');
			let addComma = false;
			for (const [key, value] of pushInstruction.value) {
				if (addComma) {
					result.append(',');
				}
				else
					addComma = true;
				result.append(`[${JSON.stringify(key)},${JSON.stringify(value)}]`);
			}
			return result.toString() + '])';
		}
	}
	return JSON.stringify(pushInstruction.value);
};