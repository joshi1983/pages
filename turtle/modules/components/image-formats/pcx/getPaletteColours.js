import { uses256ColourPalette } from './uses256ColourPalette.js';

export function getPaletteColours(byteArray) {
	const bitsPerPlane = byteArray[3];
	const numberOfColorPlanes = byteArray[65];
	let numberOfColours = 0;
	let paletteStartIndex = 16;
	if (uses256ColourPalette(bitsPerPlane, numberOfColorPlanes)) {
		numberOfColours = 256;
		paletteStartIndex = byteArray.length - 256 * 3;
	}
	else {
		const totalBits = bitsPerPlane * numberOfColorPlanes;
		if (totalBits > 8)
			return []; // indicate no palette.

		numberOfColours = 1 << totalBits;
	}
	const result = [];
	for (let i = 0; i < numberOfColours; i++) {
		const r = byteArray[paletteStartIndex];
		const g = byteArray[paletteStartIndex + 1];
		const b = byteArray[paletteStartIndex + 2];
		result.push([r, g, b, 255]);
		paletteStartIndex += 3;
	}
	return result;
};