// Reads 2-byte, 16-bit unsigned integer value.
// BE = Big Endian
export function readUint16BE(byteArray, startIndex) {
	const byte1 = byteArray[startIndex];
	const byte2 = byteArray[startIndex + 1];
	return (byte1 << 8) | byte2;
};