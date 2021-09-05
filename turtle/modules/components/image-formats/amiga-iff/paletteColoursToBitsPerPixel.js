export function paletteColoursToBitsPerPixel(paletteColours) {
	if (paletteColours === undefined)
		return 24;

	return Math.max(1, Math.ceil(Math.log2(paletteColours.length)));
};