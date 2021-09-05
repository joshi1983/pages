import { readUint16 } from
'../readUint16.js';
import { readUint32 } from
'../readUint32.js';

export function getMetaForWindowsBitmap(byteArray) {
	const width = readUint32(byteArray, 0x12);
	const height = readUint32(byteArray, 0x16);
	const numberOfColorPlanes = readUint16(byteArray, 0x1A);
	const bitsPerPixel = readUint16(byteArray, 0x1C);
	const encoding = readUint32(byteArray, 0x1E);
	let paletteLength = readUint32(byteArray, 0x2E);
	if (bitsPerPixel <= 8 && ((paletteLength === 0)  ||
	(paletteLength > 4096))) {
		// Some bmp files are inconsistent with documentation.
		// This corrects for some of the inconsistent usage of the bmp format.
		paletteLength = 1 << bitsPerPixel;
	}
	let bytesPerLine = Math.ceil(bitsPerPixel * width / 8);
	if ((bytesPerLine & 3) !== 0)
		bytesPerLine += 4 - (bytesPerLine & 3); // pad to the nearest 4-byte boundary.
	const pixelDataStartIndex = readUint32(byteArray, 0xA);
	const paletteStartOffset = pixelDataStartIndex - (4 * paletteLength);
	return {
		'bitsPerPixel': bitsPerPixel,
		'bytesPerLine': bytesPerLine,
		'encoding': encoding,
		'numberOfColorPlanes': numberOfColorPlanes,
		'paletteLength': paletteLength,
		'paletteStartOffset': paletteStartOffset,
		'pixelDataStartIndex': pixelDataStartIndex,
		'width': width,
		'height': height
	};
};