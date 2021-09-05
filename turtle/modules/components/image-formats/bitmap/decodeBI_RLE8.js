import { padToLineAlignment } from './padToLineAlignment.js';

export function decodeBI_RLE8(byteArray, startIndex, height, bytesPerLine) {
	if (!Number.isInteger(startIndex))
		throw new Error(`startIndex must be an integer but found ${startIndex}`);
	if (!Number.isInteger(height))
		throw new Error(`height must be an integer but found ${height}`);
	if (!Number.isInteger(bytesPerLine))
		throw new Error(`bytesPerLine must be an integer but found ${bytesPerLine}`);
	else if (bytesPerLine <= 0)
		throw new Error(`bytesPerLine must be over 0 but found ${bytesPerLine}`);

	const result = [];
	function nextLine() {
		const byteIndexX = result.length % bytesPerLine;
		if (byteIndexX === 0)
			result.push(0);

		padToLineAlignment(result, bytesPerLine);
	}

	for (let i = startIndex; i < byteArray.length; i++) {
		const val = byteArray[i];
		if (val === 0) {
			if (byteArray.length > i + 1) {
				// absolute mode
				let count = byteArray[i + 1];
				if (count === 0) {
					// end of line.
					padToLineAlignment(result, bytesPerLine);
					i++;
					continue;
				}
				else if (count === 1) {
					// end of bitmap
					break;
				}
				else if (count === 2) {
					const rightOffset = byteArray[i + 2];
					const downOffsetOriginal = byteArray[i + 3];
					let bytesIntoLine = result.length % bytesPerLine;
					if (downOffsetOriginal === 0)
						bytesIntoLine = 0;
					let downOffset = downOffsetOriginal;
					for (;downOffset > 0; downOffset--) {
						nextLine();
					}
					const goalByteIndex = result.length + rightOffset + bytesIntoLine;
					while (goalByteIndex > result.length)
						result.push(0);

					i += 3;
					continue;
				}
				let j = 2;
				let newI = i + count + 1;
				if ((newI & 1) === 0)
					newI++; // pad to word(2-byte alignment)
				while (count > 0) {
					const val = byteArray[i + j];
					result.push(val);
					j++;
					count--;
				}
				i = newI;
			}
		}
		else {
			// Encoded mode
			const byteToRepeat = byteArray[i + 1];
			let count = val;
			while (count > 0) {
				result.push(byteToRepeat);
				count--;
			}
			i++;
		}
	}
	const bytesRequired = height * bytesPerLine;
	while (result.length < bytesRequired) {
		result.push(0);
	}
	return result;
};