export function getPixelColoursRGBA4Planes(decompressedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * 4 * bytesPerLine;
		for (let x = 0; x < width; x++) {
			const pixelIndex = rowStart + x;
			const r = decompressedPixelData[pixelIndex];
			const g = decompressedPixelData[pixelIndex + bytesPerLine];
			const b = decompressedPixelData[pixelIndex + 2 * bytesPerLine];
			const alpha = decompressedPixelData[pixelIndex + 3 * bytesPerLine];
			row.push([r, g, b, alpha]);
		}
		result[y] = row;
	}
	return result;
};