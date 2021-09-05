import { padToLineAlignment } from './padToLineAlignment.js';

/*
This is documented at:
https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-wmf/73b57f24-6d78-4eeb-9c06-8f892d88f1ab
*/
export function decodeBI_RLE4(byteArray, startIndex, height, bytesPerLine) {
	if (!Number.isInteger(startIndex))
		throw new Error(`startIndex must be an integer but found ${startIndex}`);
	if (!Number.isInteger(height))
		throw new Error(`height must be an integer but found ${height}`);
	if (!Number.isInteger(bytesPerLine))
		throw new Error(`bytesPerLine must be an integer but found ${bytesPerLine}`);
	else if (bytesPerLine <= 0)
		throw new Error(`bytesPerLine must be over 0 but found ${bytesPerLine}`);

	const result = [];
	let resultNibbleIndex = 0;
	function addNibble(nibble) {
		if ((resultNibbleIndex & 1) === 0) {
			const newByte = nibble << 4;
			result.push(newByte);
		}
		else {
			const newByteVal = (result[result.length - 1] | nibble);
			result[result.length - 1] = newByteVal;
		}
		resultNibbleIndex++;
	}
	function nextLine() {
		const byteIndexX = result.length % bytesPerLine;
		if (byteIndexX === 0)
			result.push(0);

		padToLineAlignment(result, bytesPerLine);
		resultNibbleIndex = result.length * 2;
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
					resultNibbleIndex = result.length * 2;
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
					let nibblesIntoLine = resultNibbleIndex % (bytesPerLine * 2); 
					// * 2 because there are 2 nibbles per byte.
					if (downOffsetOriginal === 0)
						nibblesIntoLine = 0;
					let downOffset = downOffsetOriginal;
					for (;downOffset > 0; downOffset--) {
						nextLine();
					}
					const goalNibbleIndex = resultNibbleIndex + rightOffset + nibblesIntoLine;
					while (goalNibbleIndex > resultNibbleIndex)
						addNibble(0);

					i += 3;
					continue;
				}
				let j = 2;
				let newI = i + Math.ceil(count / 2) + 1;
				if ((newI & 1) === 0)
					newI++; // pad to word(2-byte alignment)
				while (count > 0) {
					const packedVal = byteArray[i + j];
					addNibble(packedVal >> 4);
					if (count > 1)
						addNibble(packedVal & 0x0f);
					j++;
					count -= 2; // 2 pixels represented by each byte.
				}
				i = newI;
			}
		}
		else {
			// Encoded mode
			const byteToRepeat = byteArray[i + 1];
			let count = val;
			while (count > 0) {
				addNibble(byteToRepeat >> 4);
				if (count > 1)
					addNibble(byteToRepeat & 0xf);
				count -= 2; // 2 pixels per byte
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