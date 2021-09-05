export function readUint16(byteArray, startIndex) {
	const byte1 = byteArray[startIndex];
	const byte2 = byteArray[startIndex + 1];
	return (byte2 << 8) | byte1;
};