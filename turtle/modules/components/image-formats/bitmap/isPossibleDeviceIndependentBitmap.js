import { readUint16 } from
'../readUint16.js';
import { readUint32 } from
'../readUint32.js';

const bitNumberSet = new Set([
	1, 2, 4, 8, 15, 16, 24, 32
]);

/*
Checks if this is a DIB(not a Windows Bitmap).
*/
export function isPossibleDeviceIndependentBitmap(byteArray) {
	if (byteArray[0] !== 0x42 ||
	byteArray[1] !== 0x4d)
		return false;

	const width = readUint16(byteArray, 0x12);
	const height = readUint16(byteArray, 0x14);
	if (width === 0)
		return false;
	if (height === 0)
		return false;
	const headerSize = readUint32(byteArray, 0xe);
	if (headerSize === 0 || headerSize >= byteArray.length)
		return false;

	const numberOfPlanes = readUint16(byteArray, 0x16);
	// documentation at:
	// https://en.wikipedia.org/wiki/BMP_file_format
	// says "The number of color planes, must be 1"
	if (numberOfPlanes !== 1)
		return false;

	const bitsPerPixel = readUint16(byteArray, 0x18);
	if (!bitNumberSet.has(bitsPerPixel))
		return false;
	return true;
};