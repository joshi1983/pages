export function getPixelColoursMonochromeOnePlane(decompressedPixelData, paletteColours,
width, height) {
	const result = [];
	let bytesPerChannelLine = Math.ceil(width / 8);
	if (bytesPerChannelLine & 1 === 1)
		bytesPerChannelLine++;
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * bytesPerChannelLine;
		for (let byteIndex = 0; row.length < width; byteIndex++) {
			const packedByte = decompressedPixelData[rowStart + byteIndex];
			for (let i = 7; row.length < width && i >= 0; i--) {
				row.push(paletteColours[(packedByte >> i) & 1]);
			}
		}
		result[y] = row;
	}
	return result;
};