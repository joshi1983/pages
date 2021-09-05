import { decodeBI_RLE4 } from './decodeBI_RLE4.js';
import { decodeBI_RLE8 } from './decodeBI_RLE8.js';

function getFromUncompressed(byteArray, startIndex, height, bytesPerLine) {
	const result = [];
	const numBytes = height * bytesPerLine;
	for (let i = 0; i < numBytes; i++) {
		result.push(byteArray[startIndex + i]);
	}
	return result;
}

export function decodePixelDataForWindowsBitmap(byteArray, startIndex,
width, height, bitDepth, numberOfPlanes, encoding, bytesPerLine) {
	if (!Number.isInteger(encoding))
		throw new Error(`encoding must be an integer but found ${encoding}`);
	if (!Number.isInteger(bytesPerLine))
		throw new Error(`bytesPerLine must be an integer but found ${bytesPerLine}`);

	if (encoding === 1)
		return decodeBI_RLE8(byteArray, startIndex, height, bytesPerLine);
	else if (encoding === 2)
		return decodeBI_RLE4(byteArray, startIndex, height, bytesPerLine);

	return getFromUncompressed(byteArray, startIndex, height, bytesPerLine);
};