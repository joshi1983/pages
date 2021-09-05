function getBit(uncompressedPixelData, x, y, bitIndex, bytesPerPixelYRow, bytesPerBitLine) {
	const byteVal = uncompressedPixelData[y * bytesPerPixelYRow + bitIndex * bytesPerBitLine + Math.floor(x / 8)];
	const bitIndexInByte = bitIndex & 7;
	return (byteVal >> bitIndexInByte) & 1;
}

export function getPixelDataWithJoinedBitPlanes(uncompressedPixelData, bitCount, width, height) {
	if (!Number.isInteger(bitCount))
		throw new Error(`bitCount must be an integer but found ${bitCount}`);
	if (!Number.isInteger(width))
		throw new Error(`width must be an integer but found ${width}`);
	if (!Number.isInteger(height))
		throw new Error(`height must be an height but found ${height}`);

	let bytesPerBitLine = Math.floor(width / 8);
	if (bytesPerBitLine & 1 === 1)
		bytesPerBitLine++;

	const bytesPerPixelYRow = bytesPerBitLine * bitCount;
	const result = [];
	// loop through scan lines.
	for (let y = 0; y < height; y++) {
		const resultLine = [];
		for (let x = 0; x < width; x++) {
			let nextByte = 0;
			// loop through bit planes.
			for (let bitIndex = 0; bitIndex < bitCount; bitIndex++) {
				const bit = getBit(uncompressedPixelData, x, y, bitIndex, bytesPerPixelYRow, bytesPerBitLine);
				nextByte = nextByte << 1;
				nextByte |= bit;

				if (bitIndex % 8 === 0) {
					resultLine.push(nextByte);
					nextByte = 0;
				}
			}
			if ((bitIndex + 1) % 8 !== 0)
				resultLine.push(nextByte);
		}
		result.push(resultLine);
	}
	return result;
};