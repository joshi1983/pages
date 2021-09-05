import { readAsByteString } from '../readAsByteString.js';
import { readUint32BE } from '../readUint32BE.js';

export function getChunkByName(byteArray, chunkName) {
	let i = 0xC; // start at the beginning of the ILBM chunk.

	// loop through chunks.
	while (i < byteArray.length) {
		const name = readAsByteString(byteArray, i, 4);
		if (name === chunkName)
			return i + 8;

		let offset = readUint32BE(byteArray, i + 4) + 8;
		if (offset & 1 === 1)
			offset++; // skip padding byte.
			// When the byte count is odd, a padding byte is used.

		i += offset;
	}
};