import { StringBuffer } from '../../StringBuffer.js';

export function word() {
	let result = new StringBuffer();
	for (let i = 0; i < arguments.length; i++) {
		result.append(arguments[i]);
	}
	return result.toString();
}