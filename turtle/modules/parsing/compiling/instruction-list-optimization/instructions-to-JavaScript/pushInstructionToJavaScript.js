import { EasingFunction } from '../../../../drawing/vector/easing/EasingFunction.js';
import { StringBuffer } from '../../../../StringBuffer.js';
import { Transparent } from '../../../../Transparent.js';

function valueToJavaScript(value, maxRecursiveDepth) {
	if (maxRecursiveDepth < 0)
		return JSON.stringify(value);
	if (value === Transparent)
		return 'this.Transparent';
	else if (value instanceof EasingFunction)
		return value.toJavaScriptExpression();
	else if (value instanceof Array) {
		const result = new StringBuffer(50);
		result.append('[');
		let addComma = false;
		for (let i = 0; i < value.length; i++) {
			if (addComma) {
				result.append(',');
			}
			else
				addComma = true;
			result.append(valueToJavaScript(value[i], maxRecursiveDepth - 1));
		}
		return result.toString() + ']';
	}
	else if (value instanceof Map) {
		if (value.size === 0)
			return 'new Map()';
		else {
			const result = new StringBuffer(50);
			result.append('new Map([');
			let addComma = false;
			for (const [key, val] of value) {
				if (addComma) {
					result.append(',');
				}
				else
					addComma = true;
				result.append(`[${valueToJavaScript(key, maxRecursiveDepth - 1)},${valueToJavaScript(val, maxRecursiveDepth - 1)}]`);
			}
			return result.toString() + '])';
		}
	}
	return JSON.stringify(value);
}

export function pushInstructionToJavaScript(pushInstruction) {
	return valueToJavaScript(pushInstruction.value, 20);
};