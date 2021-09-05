import { getPixelColoursForMonochromeWindowsBitmap } from
'./getPixelColoursForMonochromeWindowsBitmap.js';
import { getPixelColoursFor16bitWindowsBitmap } from
'./getPixelColoursFor16bitWindowsBitmap.js';
import { getPixelColoursFor16ColourWindowsBitmap } from
'./getPixelColoursFor16ColourWindowsBitmap.js';
import { getPixelColoursFor256ColourWindowsBitmap } from
'./getPixelColoursFor256ColourWindowsBitmap.js';
import { getPixelColoursForRGBAWindowsBitmap } from
'./getPixelColoursForRGBAWindowsBitmap.js';
import { getPixelColoursForRGBWindowsBitmap } from
'./getPixelColoursForRGBWindowsBitmap.js';


export function getPixelColoursForWindowsBitmap(decodedPixelData, paletteColours,
width, height, bitsPerPixel, bytesPerLine) {
	if (!Number.isInteger(bytesPerLine))
		throw new Error(`bytesPerLine must be an integer but found ${bytesPerLine}`);

	if (bitsPerPixel === 1)
		return getPixelColoursForMonochromeWindowsBitmap(decodedPixelData, paletteColours, width, height, bytesPerLine);

	// FIXME: should 2-bit bitsPerPixel be supported?
	// 2-bit isn't mentioned at https://en.wikipedia.org/wiki/BMP_file_format
	// but it would pack 4 pixels into a byte perfectly.

	if (bitsPerPixel === 4)
		return getPixelColoursFor16ColourWindowsBitmap(decodedPixelData, paletteColours, width, height, bytesPerLine);
	if (bitsPerPixel === 8)
		return getPixelColoursFor256ColourWindowsBitmap(decodedPixelData, paletteColours, width, height, bytesPerLine);
	if (bitsPerPixel === 16)
		return getPixelColoursFor16bitWindowsBitmap(decodedPixelData, paletteColours, width, height, bytesPerLine);
	if (bitsPerPixel === 24)
		return getPixelColoursForRGBWindowsBitmap(decodedPixelData, paletteColours,
width, height, bytesPerLine);
	if (bitsPerPixel === 32)
		return getPixelColoursForRGBAWindowsBitmap(decodedPixelData, paletteColours,
width, height, bytesPerLine);
	return [];
};