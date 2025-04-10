import { ArrayUtils } from
'../../../ArrayUtils.js';
import { duplicate } from
'../../../command-groups/helpers/duplicate.js';

export function decompress(byteArray, startIndex,
width, height, bitDepth, numPlanes) {
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
			if (byteRow.length & 1 === 1)
				result.push(0); // make sure the length even.
		}
	}
	return result;
};