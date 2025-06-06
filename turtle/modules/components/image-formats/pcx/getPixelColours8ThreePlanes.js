import { getBit } from '../getBit.js';

export function getPixelColours8ThreePlanes(decodedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * bytesPerLine * 3;
		for (let x = 0; row.length < width; x++) {
			let indexStart = rowStart + Math.floor(x / 8);
			let bitOffset = 7 - (x % 8);
			let paletteIndex = 0;
			for (let i = 0; i < 3; i++) {
				paletteIndex = paletteIndex << 1;
				paletteIndex = paletteIndex |
					getBit(decodedPixelData, indexStart + bytesPerLine * i, bitOffset);
			}
			row.push(paletteColours[paletteIndex]);
		}
		result[y] = row;
	}
	return result;
};