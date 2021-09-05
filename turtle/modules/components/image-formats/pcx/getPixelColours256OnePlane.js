export function getPixelColours256OnePlane(decompressedPixelData, paletteColours,
width, height, bytesPerChannelLine) {
	const result = [];
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * bytesPerChannelLine;
		for (let x = 0; x < width; x++) {
			const paletteIndex = decompressedPixelData[rowStart + x];
			row.push(paletteColours[paletteIndex]);
		}
		result[y] = row;
	}
	return result;
};