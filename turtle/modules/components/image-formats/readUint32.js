export function readUint32(byteArray, startIndex) {
	let result = 0;
	for (let i = 3; i >= 0; i--) {
		result = (result << 8) | byteArray[startIndex + i];
	}
	return result;
};