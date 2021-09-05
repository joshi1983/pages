export function getPixelColoursForRGBAWindowsBitmap(decodedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = height - 1; y >= 0; y--) {
		const row = [];
		const startIndex = y * bytesPerLine;
		for (let x = 0; x < width; x++) {
			const index = startIndex + x * 4;
			const blue = decodedPixelData[index];
			const green = decodedPixelData[index + 1];
			const red = decodedPixelData[index + 2];
			const alpha = decodedPixelData[index + 3];
			row.push([red, green, blue, alpha]);
		}
		result.push(row);
	}
	return result;
};