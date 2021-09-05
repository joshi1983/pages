import { getBit } from '../getBit.js';

export function getPixelColoursMonochromeOnePlane(decompressedPixelData, paletteColours,
width, height, bytesPerChannelLine) {
	const result = [];
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * bytesPerChannelLine;
		for (let x = 0; row.length < width ; x++) {
			const indexStart = rowStart + Math.floor(x / 8);
			const bitOffset = 7 - (x % 8);
			row.push(paletteColours[getBit(decompressedPixelData, indexStart, bitOffset)]);
		}
		result[y] = row;
	}
	return result;
};