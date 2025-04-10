export function getPixelColoursMonochromeOnePlane(decompressedPixelData, paletteColours,
width, height) {
	const result = [];
	let bytesPerChannelLine = Math.ceil(width / 8);
	if (bytesPerChannelLine & 1 === 1)
		bytesPerChannelLine++;
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * bytesPerChannelLine;
		for (let x = 0; row.length < width; x++) {
			const paletteIndex = decompressedPixelData[rowStart + x];
			for (let i = 7; row.length < width && i >= 0; i--) {
				row.push(paletteColours[(paletteIndex >> i) & 1]);
			}
		}
		result[y] = row;
	}
	return result;
};