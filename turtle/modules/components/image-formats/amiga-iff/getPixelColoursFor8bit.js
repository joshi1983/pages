/*
decodedPixelData should have all bit planes processed so that
most bytes represent colour palette indexes.
*/
export function getPixelColoursFor8bit(decodedPixelData, paletteColours,
width, height, bytesPerLine) {
	let index;
	const result = [];
	for (let y = 0; y < height; y++) {
		index = y * bytesPerLine;
		const row = [];
		for (let x = 0; x < width; x++) {
			row.push(paletteColours[index]);
			index++;
		}
		result.push(row);
	}
	return result;
};