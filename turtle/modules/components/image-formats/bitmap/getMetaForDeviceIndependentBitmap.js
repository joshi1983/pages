import { readUint16 } from
'../readUint16.js';

export function getMetaForDeviceIndependentBitmap(byteArray) {
	const width = readUint16(byteArray, 0x12);
	const height = readUint16(byteArray, 0x14);
	const bitsPerPixel = readUint16(byteArray, 0x18);
	const numberOfPlanes = readUint16(byteArray, 0x16);
	let paletteStartOffset = 0;
	// FIXME: find where palette should start.
	return {
		'width': width,
		'height': height,
		'bitsPerPixel': bitsPerPixel,
		'numberOfColorPlanes': numberOfPlanes,
		'paletteStartOffset': paletteStartOffset
	};
};