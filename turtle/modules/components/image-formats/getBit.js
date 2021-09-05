export function getBit(decodedPixelData, indexStart, bitOffset) {
	const byteVal = decodedPixelData[indexStart];
	if (byteVal === undefined)
		return 1;
	return (byteVal >> bitOffset) & 1;
};