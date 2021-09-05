import { readUint16 } from
'../readUint16.js';
import { readUint32 } from
'../readUint32.js';

// 8K resolution dimensions would be exceedingly large.
// 32000 would be multiples higher than that and strongly indicate
// that the number doesn't correspond with a real width or height of an image.
const maxReasonableSize = 32000;

export function isPossibleWindowsBitmap(byteArray) {
	if (byteArray.length < 0x46)
		return false;
	if (byteArray[0] !== 0x42 ||
	byteArray[1] !== 0x4D)
		return false;
	const fileSize = readUint32(byteArray, 2);
	/*
	documentation says fileSize should be exactly byteArray.length.
	We'll return false only if fileSize > byteArray.length instead of fileSize !== byteArray.length
	just because I came across a test file that the !== would fail on.
	The file is violating the documentation but since it loads in GIMP and elsewhere problem-free, 
	the documentation isn't being followed perfectly for fileSize.
	*/
	if (fileSize > byteArray.length)
		return false;

	const bitsPerPixel = readUint16(byteArray, 0x1C);
	// Bits per pixel is documented at:
	// https://en.wikipedia.org/wiki/BMP_file_format
	// that typical values are 1, 4, 8, 16, 24 and 32.
	// More than 48 is so unlikely that we'll consider it not possible.
	// If a bitmap file ever is found with greater than 48, 
	// this can be adjusted but it seems unlikely enough to make this check for now.
	if (bitsPerPixel > 48 || bitsPerPixel <= 0)
		return false;
	const headerSize = readUint32(byteArray, 0xE);
	if (headerSize > byteArray.length)
		return false;

	const numberOfChannels = readUint16(byteArray, 0x1A);
	if (numberOfChannels !== 1)
		return false; // documentation says the number of color planes/channels must always be 1.

	const width = readUint32(byteArray, 0x12);
	if (width > maxReasonableSize)
		return false;

	const height = readUint32(byteArray, 0x16);
	if (height > maxReasonableSize)
		return false;
	
	return true;
};