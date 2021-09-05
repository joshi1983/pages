export function uses256ColourPalette(bitDepth, planeCount) {
	return bitDepth * planeCount === 8;
	// usually this would be a bitDepth of 8 
	// and planeCount of 1 but not necessarily.
};