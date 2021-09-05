/*
I couldn't find a 4-colour palette format documented at:
https://en.wikipedia.org/wiki/PCX.
I'm adding this to support the case anyway because documentation doesn't
say it is impossible.
*/
export function getPixelColours4OnePlane(
decompressedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * bytesPerLine;
		for (let x = 0; row.length < width; x++) {
			const paletteIndex = decompressedPixelData[rowStart + x];
			for (let i = 6; row.length < width && i >= 0; i -= 2) {
				row.push(paletteColours[(paletteIndex >> i) & 3]);
			}
		}
		result[y] = row;
	}
	return result;
};