import { getChunkByName } from './getChunkByName.js';
import { readUint32BE } from '../readUint32BE.js';

const signatures = [
	[0, 'FORM'], 
		// An Amiga IFF file can start with 'CAT ' and 'LIST' but those are for having multiple images in a single file.
		// We're not testing or supporting IFF files containing multiple images.
	[8, 'ILBM']
];

function isPairFound(byteArray, startIndex, s) {
	for (let i = 0; i < s.length; i++) {
		if (byteArray[startIndex + i] !== s[i].charCodeAt(0))
			return false;
	}
	return true;
}

export function isPossibleMatch(byteArray) {
	if (byteArray.length < 4)
		return false;

	// is the signature matched?
	for (const [startIndex, s] of signatures) {
		if (!isPairFound(byteArray, startIndex, s))
			return false;
	}
	const dataSize = readUint32BE(byteArray, 4);
	if (dataSize !== byteArray.length - 8)
		return false;
		// data size should be exactly number of file bytes minus 8.
		// I guess the 8 comes from 'FORM'.length + 4(bytes in the dataSize's 32-bit representation

	const bodyPosition = getChunkByName(byteArray, 'BODY');
	if (bodyPosition === undefined)
		return false;

	return true;
};