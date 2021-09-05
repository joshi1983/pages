export function getPixelColoursFor256ColourWindowsBitmap(decodedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = height - 1; y >= 0; y--) {
		const row = [];
		const startIndex = y * bytesPerLine;
		for (let x = 0; x < width; x++) {
			const index = decodedPixelData[startIndex + x];
			row.push(paletteColours[index]);
		}
		result.push(row);
	}
	return result;
};