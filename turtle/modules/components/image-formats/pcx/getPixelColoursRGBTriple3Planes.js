export function getPixelColoursRGBTriple3Planes(decodedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * 3 * bytesPerLine;
		for (let x = 0; x < width; x++) {
			const pixelIndex = rowStart + x;
			const r = decodedPixelData[pixelIndex];
			const g = decodedPixelData[pixelIndex + bytesPerLine];
			const bIndex = pixelIndex + 2 * bytesPerLine;
			const b = decodedPixelData[bIndex];
			if (!Number.isInteger(b))
				throw new Error(`Expected an integer blue value but found ${b} for pixel x=${x}, y=${y}.  ` +
				`decodedPixelData.length=${decodedPixelData.length}, bIndex=${bIndex}, bytesPerLine=${bytesPerLine}`);
			row.push([r, g, b, 255]);
		}
		result[y] = row;
	}
	return result;
};