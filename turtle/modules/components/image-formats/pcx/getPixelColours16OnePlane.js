export function getPixelColours16OnePlane(
decompressedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * bytesPerLine;
		for (let x = 0; row.length < width; x++) {
			const paletteIndex = decompressedPixelData[rowStart + x];
			row.push(paletteColours[paletteIndex >> 4]);
			if (row.length < width)
				row.push(paletteColours[paletteIndex & 0xf]);
		}
		result[y] = row;
	}
	return result;
};