import { ArrayUtils } from
'../../../ArrayUtils.js';
import { duplicate } from
'../../../command-groups/helpers/duplicate.js';

function decompressRLE(byteArray, startIndex,
width, height, bitDepth, numPlanes, bytesPerLine) {
	const result = [];
	const bytesPerRow = Math.ceil(width * bitDepth / 8);
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < numPlanes; j++) {
			const byteRow = [];
			while (startIndex < byteArray.length && byteRow.length < bytesPerRow) {
				const byteVal = byteArray[startIndex];
				if ((byteVal & 0xC0) === 0xC0 &&
				startIndex < byteArray.length - 1) {
					const runLength = byteVal & 0x3F;
					const repeatedVal = byteArray[startIndex + 1];
					byteRow.push(...duplicate(repeatedVal, runLength));
					startIndex++;
				}
				else {
					byteRow.push(byteVal);
				}
				startIndex++;
			}
			ArrayUtils.pushAll(result, byteRow);
		}
	}
	return result;
}

function getFromUncompressed(byteArray, startIndex,
width, height, bitDepth, numPlanes, bytesPerLine) {
	const result = [];
	const bytesPerRow = Math.ceil(width * bitDepth / 8);
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < numPlanes; j++) {
			const byteRow = [];
			while (startIndex < byteArray.length && byteRow.length < bytesPerRow) {
				byteRow.push(byteArray[startIndex]);
				startIndex++;
			}
			ArrayUtils.pushAll(result, byteRow);
		}
	}
	return result;
}

export function decode(byteArray, startIndex,
width, height, bitDepth, numPlanes, encoding, bytesPerLine) {
	if (!Number.isInteger(encoding))
		throw new Error(`encoding must be an integer but found ${encoding}`);
	if (!Number.isInteger(bytesPerLine))
		throw new Error(`bytesPerLine must be an integer but found ${bytesPerLine}`);
	if (encoding === 1)
		return decompressRLE(byteArray, startIndex,
width, height, bitDepth, numPlanes, bytesPerLine);
	else
		return getFromUncompressed(byteArray, startIndex,
width, height, bitDepth, numPlanes, bytesPerLine);
};