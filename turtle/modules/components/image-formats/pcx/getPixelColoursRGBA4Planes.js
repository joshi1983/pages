export function getPixelColoursRGBA4Planes(decompressedPixelData, paletteColours,
width, height) {
	const result = [];
	let bytesPerChannelLine = width;
	if (bytesPerChannelLine & 1 === 1)
		bytesPerChannelLine++;
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStart = y * 4 * bytesPerChannelLine;
		for (let x = 0; x < width; x++) {
			const pixelIndex = rowStart + x * 4;
			const r = decompressedPixelData[pixelIndex];
			const g = decompressedPixelData[pixelIndex + bytesPerChannelLine];
			const b = decompressedPixelData[pixelIndex + 2 * bytesPerChannelLine];
			const alpha = decompressedPixelData[pixelIndex + 3 * bytesPerChannelLine];
			row.push([r, g, b, alpha]);
		}
		result[y] = row;
	}
	return result;
};