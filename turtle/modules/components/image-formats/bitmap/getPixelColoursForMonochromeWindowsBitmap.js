import { getBit } from '../getBit.js';

export function getPixelColoursForMonochromeWindowsBitmap(decodedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = height - 1; y >= 0; y--) {
		const row = [];
		const startIndex = y * bytesPerLine;
		for (let x = 0; x < width; x++) {
			const byteIndex = startIndex + Math.floor(x / 8);
			const bitOffset = 7 - (x % 8);
			const index = getBit(decodedPixelData, byteIndex, bitOffset);
			row.push(paletteColours[index]);
		}
		result.push(row);
	}
	return result;
};