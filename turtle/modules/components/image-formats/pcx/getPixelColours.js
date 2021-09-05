import { getPixelColours16FourPlanes } from './getPixelColours16FourPlanes.js';
import { getPixelColours16OnePlane } from './getPixelColours16OnePlane.js';
import { getPixelColours256OnePlane } from './getPixelColours256OnePlane.js';
import { getPixelColours4OnePlane } from './getPixelColours4OnePlane.js';
import { getPixelColours8ThreePlanes } from './getPixelColours8ThreePlanes.js';
import { getPixelColoursMonochromeOnePlane } from './getPixelColoursMonochromeOnePlane.js';
import { getPixelColoursRGBTriple3Planes } from './getPixelColoursRGBTriple3Planes.js';
import { getPixelColoursRGBA4Planes } from './getPixelColoursRGBA4Planes.js';

export function getPixelColours(decompressedPixelData, paletteColours, width, height,
bitsPerPlane, numberOfColorPlanes, bytesPerLine) {
	if (!(paletteColours instanceof Array))
		throw new Error(`paletteColours must be an Array but found ${paletteColours}`);
	if (!Number.isInteger(bytesPerLine))
		throw new Error(`bytesPerLine must be an integer but found ${bytesPerLine}`);
	if (numberOfColorPlanes === 1) {
		if (bitsPerPlane === 8)
			return getPixelColours256OnePlane(decompressedPixelData, paletteColours,
				width, height, bytesPerLine);
		if (bitsPerPlane === 4)
			return getPixelColours16OnePlane(decompressedPixelData, paletteColours,
				width, height, bytesPerLine);
		if (bitsPerPlane === 2)
			return getPixelColours4OnePlane(decompressedPixelData, paletteColours,
				width, height, bytesPerLine);
		if (bitsPerPlane === 1)
			return getPixelColoursMonochromeOnePlane(decompressedPixelData, paletteColours,
				width, height, bytesPerLine);
	}
	else if (numberOfColorPlanes === 3) {
		if (bitsPerPlane === 1)
			return getPixelColours8ThreePlanes(decompressedPixelData, paletteColours,
				width, height, bytesPerLine);
	}
	else if (numberOfColorPlanes === 4) {
		if (bitsPerPlane === 1)
			return getPixelColours16FourPlanes(decompressedPixelData, paletteColours,
				width, height, bytesPerLine);
	}
	if (bitsPerPlane === 8) {
		if (numberOfColorPlanes === 3)
			return getPixelColoursRGBTriple3Planes(decompressedPixelData, paletteColours,
width, height, bytesPerLine);
		if (numberOfColorPlanes === 4)
			return getPixelColoursRGBA4Planes(decompressedPixelData, paletteColours,
width, height, bytesPerLine);
	}
	const result = [];
	for (let y = 0; y < height; y++) {
		const row = [];
		for (let x = 0; x < width; x++) {
			
		}
		result[y] = row;
	}
	return result;
};