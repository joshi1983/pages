export function readAsByteString(byteArray, startIndex, len) {
	let result = '';
	for (let i = 0; i < len; i++) {
		result += String.fromCharCode(byteArray[startIndex + i]);
	}
	return result;
};