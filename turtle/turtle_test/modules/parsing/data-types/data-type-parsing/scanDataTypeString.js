import { DataTypeScanToken } from './DataTypeScanToken.js';

export function scanDataTypeString(s) {
	const result = [];
	let currentToken = '';
	function pushToken(t) {
		if (currentToken !== '') {
			result.push(new DataTypeScanToken(currentToken));
			currentToken = '';
		}
		if (t !== undefined)
			result.push(t);
	}
	for (let i = 0; i < s.length; i++) {
		const ch = s.charAt(i);
		if ('<>|'.indexOf(ch) !== -1) {
			pushToken(new DataTypeScanToken(ch));
		}
		else {
			currentToken += ch;
		}
	}
	pushToken();
	return result;
};