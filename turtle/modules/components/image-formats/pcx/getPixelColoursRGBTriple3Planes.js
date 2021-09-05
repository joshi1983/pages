export function getPixelColoursRGBTriple3Planes(decodedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * 3 * bytesPerLine;
		for (let x = 0; x < width; x++) {
			const pixelIndex = rowStart + x;
			let r = decodedPixelData[pixelIndex];
			let g = decodedPixelData[pixelIndex + bytesPerLine];
			const bIndex = pixelIndex + 2 * bytesPerLine;
			let b = decodedPixelData[bIndex];
			if (b === undefined) {
				if (r === undefined)
					r = 0;
				if (g === undefined)
					g = 0;
				b = 0;
			}
			row.push([r, g, b, 255]);
		}
		result[y] = row;
	}
	return result;
};