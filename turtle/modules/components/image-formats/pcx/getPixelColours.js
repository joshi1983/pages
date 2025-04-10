import { getPixelColours16OnePlane } from './getPixelColours16OnePlane.js';
import { getPixelColours256OnePlane } from './getPixelColours256OnePlane.js';
import { getPixelColours4OnePlane } from './getPixelColours4OnePlane.js';
import { getPixelColoursMonochromeOnePlane } from './getPixelColoursMonochromeOnePlane.js';
import { getPixelColoursRGBTriple3Planes } from './getPixelColoursRGBTriple3Planes.js';
import { getPixelColoursRGBA4Planes } from './getPixelColoursRGBA4Planes.js';

export function getPixelColours(decompressedPixelData, paletteColours, width, height,
bitsPerPlane, numberOfColorPlanes) {
	if (numberOfColorPlanes === 1) {
		if (bitsPerPlane === 8)
			return getPixelColours256OnePlane(decompressedPixelData, paletteColours, width, height);
		if (bitsPerPlane === 4)
			return getPixelColours16OnePlane(decompressedPixelData, paletteColours, width, height);
		if (bitsPerPlane === 2)
			return getPixelColours4OnePlane(decompressedPixelData, paletteColours, width, height);
		if (bitsPerPlane === 1)
			return getPixelColoursMonochromeOnePlane(decompressedPixelData, paletteColours, width, height);
	}
	if (bitsPerPlane === 8) {
		if (numberOfColorPlanes === 3)
			return getPixelColoursRGBTriple3Planes(decompressedPixelData, paletteColours,
width, height);
		if (numberOfColorPlanes === 4)
			return getPixelColoursRGBA4Planes(decompressedPixelData, paletteColours,
width, height);
	}
	const result = [];
	let bytesPerChannelLine = Math.ceil(width * bitsPerPlane / 8);
	if (bytesPerChannelLine & 1 === 1)
		bytesPerChannelLine++;
	for (let y = 0; y < height; y++) {
		const row = [];
		for (let x = 0; x < width; x++) {
			
		}
		result[y] = row;
	}
	return result;
};