import { ArrayUtils } from '../../ArrayUtils.js';
import { fput } from './fput.js';
const simpleTypes = new Set(['boolean', 'number', 'string']);

export function combine(a, b) {
	if (arguments.length > 2) {
		let result = a;
		for (let i = 1; i < arguments.length; i++) {
			result = combine(result, arguments[i]);
		}
		return result;
	}
	if (simpleTypes.has(typeof a)) {
		if (simpleTypes.has(typeof b))
			return a + b;
		if (b instanceof Array)
			return fput(a, b);
	}
	if (a instanceof Array) {
		if (simpleTypes.has(typeof b)) {
			const result = a.slice(0);
			result.push(b);
			return result;
		}
		else {
			const result = a.slice(0);
			ArrayUtils.pushAll(result, b);
			return result;
		}
	}
};