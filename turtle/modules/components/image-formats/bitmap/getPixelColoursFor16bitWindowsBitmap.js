import { getBit } from '../getBit.js';

function read5Bits(decodedPixelData, index, bitStartIndex) {
	let result = 0;
	let bitIndex = bitStartIndex;
	for (let i = 0; i < 5; i++) {
		if (bitIndex >= 8) {
			bitIndex -= 8;
			index++;
		}
		result = result << 1;
		result = result | getBit(decodedPixelData, index, bitIndex);
		bitIndex++;
	}
	return result;
}

function extend5Bits(decodedPixelData, index, bitStartIndex) {
	const val = read5Bits(decodedPixelData, index, bitStartIndex);
	const lastBit = (val & 1);
	return (val << 3) | (lastBit * 7);
}

export function getPixelColoursFor16bitWindowsBitmap(decodedPixelData, paletteColours,
width, height, bytesPerLine) {
	const result = [];
	for (let y = height - 1; y >= 0; y--) {
		const row = [];
		const startIndex = y * bytesPerLine;
		for (let x = 0; x < width; x++) {
			const index = startIndex + x * 2;
			const blue = extend5Bits(decodedPixelData, index, 0);
			const green = extend5Bits(decodedPixelData, index, 5);
			const red = extend5Bits(decodedPixelData, index + 1, 3);
			const alpha = 255;
			row.push([red, green, blue, alpha]);
		}
		result.push(row);
	}
	return result;
};