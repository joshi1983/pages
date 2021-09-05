
export function getPixelColoursFor16ColourWindowsBitmap(decodedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = height - 1; y >= 0; y--) {
		const row = [];
		const startIndex = y * bytesPerLine;
		for (let x = 0; x < width; x++) {
			let byteIndex = startIndex + Math.floor(x / 2);
			const byteVal = decodedPixelData[byteIndex];
			let index;
			if (x % 2 === 0)
				index = byteVal & 0xf;
			else
				index = (byteVal >> 4) & 0xf;
			row.push(paletteColours[index]);
		}
		result.push(row);
	}
	return result;
};