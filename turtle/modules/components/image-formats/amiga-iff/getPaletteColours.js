import { Colour } from '../../../Colour.js';
import { getChunkByName } from './getChunkByName.js';
import { readUint32BE } from '../readUint32BE.js';

export function getPaletteColours(byteArray) {
	const cmapPosition = getChunkByName(byteArray, 'CMAP');
	if (cmapPosition === undefined)
		return [];
	const numColourBytes = readUint32BE(byteArray, cmapPosition.dataStartIndex);
	const numColours = Math.floor(numColourBytes / 3);
	const result = [];
	for (let i = 0; i < numColours; i++) {
		const index = 0x30 + i * 3;
		const red = byteArray[index];
		const green = byteArray[index + 1];
		const blue = byteArray[index + 2];
		result[i] = new Colour(red, green, blue);
	}
	return result;
};