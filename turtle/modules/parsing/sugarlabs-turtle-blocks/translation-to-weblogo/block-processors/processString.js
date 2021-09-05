import { valueToLiteralCode } from '../../../../valueToLiteralCode.js';

export function processString(elementInfo, result) {
	let s;
	if (elementInfo.length === 2) {
		s = elementInfo[1];
		if (typeof s === 'object' &&
		s !== null &&
		typeof s.value === 'string') {
			s = s.value;
		}
	}
	if (typeof s === 'string')
		result.append(` ${valueToLiteralCode(s)} `);
};