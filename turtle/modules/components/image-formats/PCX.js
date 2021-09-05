import { decode } from './pcx/decode.js';
import { getPaletteColours } from './pcx/getPaletteColours.js';
import { getPixelColours } from './pcx/getPixelColours.js';
import { pixelColoursToImageBitmap } from './pixelColoursToImageBitmap.js';
import { readUint16 } from './readUint16.js';
import { uses256ColourPalette } from './pcx/uses256ColourPalette.js';

/*
Details on the PCX file format are at:
https://en.wikipedia.org/wiki/PCX
*/

export class PCX {
	static getMeta(byteArray) {
		if (!(byteArray instanceof Uint8Array))
			throw new Error(`byteArray must be a Uint8Array but found ${byteArray}`);
		const version = byteArray[1];
		const encoding = byteArray[2];
		const bitsPerPlane = byteArray[3];
		const minX = readUint16(byteArray, 4);
		const minY = readUint16(byteArray, 6);
		const maxX = readUint16(byteArray, 8);
		const maxY = readUint16(byteArray, 10);
		const width = maxX - minX + 1;
		const height = maxY - minY + 1;
		const numberOfColorPlanes = byteArray[65];
		const bytesPerLine = readUint16(byteArray, 66);
		const paletteMode = readUint16(byteArray, 68);

		return {
			'height': height,
			'width': width,
			'version': version,
			'encoding': encoding,
			'bitsPerPlane': bitsPerPlane,
			'bytesPerLine': bytesPerLine,
			'numberOfColorPlanes': numberOfColorPlanes,
			'paletteMode': paletteMode,
			'pixelDataStartIndex': 128
		};
	}

	static isPossibleMatch(byteArray) {
		if (!(byteArray instanceof Uint8Array))
			throw new Error(`byteArray expected to be a Uint8Array but found ${byteArray}`);

		// a key used in every PCX file
		if (byteArray[0] !== 10)
			return false;

		// The header of a PCX is 128 bytes so anything less can't be a valid PCX file.
		if (byteArray.length < 128)
			return false;
		
		const version = byteArray[1];
		// documentation says "PCX version numbers range from 0 to 5".
		if (version > 5)
			return false;

		const encoding = byteArray[2];
		// The encoding is almost always 1.
		// 0 means uncompressed but it is hardly ever used.
		// Even though 0 is exceedingly rare, this will consider it possible.
		if (encoding > 1)
			return false;

		const bitsPerPlane = byteArray[3];
		// documentation says bitsPerPlane is usually 1,2,4, or 8.
		// although, the documentation doesn't rule out another value,
		// a value over 32 seems unlikely enough to revisit this only
		// when a bug is reported about a real PCX file that violates this check.
		if (bitsPerPlane > 32)
			return false;

		const numberOfColorPlanes = byteArray[65];
		// documentation says this is mostly chosen to be 1, 3, or 4.
		// If it is over 4, it seems unlikely enough to consider it impossible.
		// If a bug is related to a case where a PCX has a value greater 4,
		// it can be dealt with when we see a real PCX file using it.
		if (numberOfColorPlanes > 4)
			return false;

		const paletteMode = readUint16(byteArray, 68);
		// palette modes 1 and 2 are documented.
		// palette mode 0xbb0 was found too for a monochrome image.
		if (paletteMode > 2 && paletteMode !== 0xbb0 && paletteMode !== 1910)
			return false;

		if (uses256ColourPalette(bitsPerPlane, numberOfColorPlanes)) {
			// there must be at least the space needed for 
			// a header and the colour palette.
			if (byteArray.length < 128 + 256 * 3)
				return false;
			// Get the byte before the 256-colour palette at the end of the file.
			const twelveByte = byteArray[byteArray.length - 769];
			// That byte should be 12, if this is a valid PCX file.
			if (twelveByte !== 12)
				return false;
		}
		return true;
	}

	static arrayBufferToImageBitmap(arrayBuffer) {
		const byteArray = new Uint8Array(arrayBuffer);
		const meta = PCX.getMeta(byteArray);
		const paletteColours = getPaletteColours(byteArray);
		const width = meta.width;
		const height = meta.height;
		const decompressedPixelData = decode(byteArray, meta.pixelDataStartIndex, width, height,
			meta.bitsPerPlane, meta.numberOfColorPlanes, meta.encoding, meta.bytesPerLine);
		const pixelColours = getPixelColours(decompressedPixelData, paletteColours, width, height,
			meta.bitsPerPlane, meta.numberOfColorPlanes, meta.bytesPerLine);

		return pixelColoursToImageBitmap(pixelColours, width, height);
	}
};