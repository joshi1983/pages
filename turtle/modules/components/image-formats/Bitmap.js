import { decodePixelDataForWindowsBitmap } from './bitmap/decodePixelDataForWindowsBitmap.js';
import { getMetaForDeviceIndependentBitmap } from './bitmap/getMetaForDeviceIndependentBitmap.js';
import { getMetaForWindowsBitmap } from './bitmap/getMetaForWindowsBitmap.js';
import { getPixelColoursForWindowsBitmap } from './bitmap/getPixelColoursForWindowsBitmap.js';
import { getWindowsBitmapPaletteColours } from './bitmap/getWindowsBitmapPaletteColours.js';
import { isPossibleDeviceIndependentBitmap } from './bitmap/isPossibleDeviceIndependentBitmap.js';
import { isPossibleWindowsBitmap } from './bitmap/isPossibleWindowsBitmap.js';
import { pixelColoursToImageBitmap } from './pixelColoursToImageBitmap.js';
import { readUint32 } from './readUint32.js';
const prefixes = [
	'BM', 'BA', 'CI', 'CP', 'IC', 'PT'
];
/*
https://en.wikipedia.org/wiki/BMP_file_format mentions all of these prefixes but IC
only found the BM prefix in all the test .bmp and .dib files I could find.
If files are found with the other documented prefixes, this should be tested and extended to support those other files.
Until then, BM is enough.  It seems like a waste of time to implement support for cases we can't properly test for
due to the case being so exceedingly rare that we can't even find test data for it.
*/
const prefixBytes = [];
for (const s of prefixes) {
	const row = s.split('').map(function(c) {
		return c.charCodeAt(0);
	});
	prefixBytes.push(row);
}
const isPossibleChecks = [isPossibleWindowsBitmap, isPossibleDeviceIndependentBitmap];

export class Bitmap {
	static getMeta(byteArray) {
		const fileSize = readUint32(byteArray, 2);
		const result = {
			'fileSize': fileSize
		};
		if (isPossibleWindowsBitmap(byteArray))
			Object.assign(result, getMetaForWindowsBitmap(byteArray));
		else if (isPossibleDeviceIndependentBitmap(byteArray))
			Object.assign(result, getMetaForDeviceIndependentBitmap(byteArray));

		return result;
	}

	static isPossibleMatch(byteArray) {
		if (byteArray.length < 15)
			return false;
		for (const isPossible of isPossibleChecks) {
			if (isPossible(byteArray))
				return true;
		}
		return false;
	}

	static arrayBufferToImageBitmap(arrayBuffer) {
		const byteArray = new Uint8Array(arrayBuffer);
		const meta = Bitmap.getMeta(byteArray);
		const decoded = decodePixelDataForWindowsBitmap(byteArray, meta.pixelDataStartIndex,
meta.width, meta.height, 1, meta.bitsPerPixel, meta.encoding, meta.bytesPerLine);
		const paletteColours = getWindowsBitmapPaletteColours(byteArray, meta.paletteStartOffset, meta.paletteLength);
		const pixelColours = getPixelColoursForWindowsBitmap(decoded, paletteColours,
			meta.width, meta.height, meta.bitsPerPixel, meta.bytesPerLine);
		return pixelColoursToImageBitmap(pixelColours, meta.width, meta.height);
	}
};