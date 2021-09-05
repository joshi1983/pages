// BE = Big Endian
export function readUint32BE(byteArray, startIndex) {
	let result = 0;
	for (let i = 0; i < 4; i++) {
		result = (result << 8) | byteArray[startIndex + i];
	}
	return result;
};