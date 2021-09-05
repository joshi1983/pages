export function getPixelColoursForRGBWindowsBitmap(decodedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = height - 1; y >= 0; y--) {
		const row = [];
		const startIndex = y * bytesPerLine;
		for (let x = 0; x < width; x++) {
			const index = startIndex + x * 3;
			const blue = decodedPixelData[index];
			const green = decodedPixelData[index + 1];
			const red = decodedPixelData[index + 2];
			const alpha = 255;
			row.push([red, green, blue, alpha]);
		}
		result.push(row);
	}
	return result;
};